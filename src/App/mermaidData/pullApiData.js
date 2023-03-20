import axios from '../../library/axiosRetry'
import {
  getLastRevisionNumbersPulledForAProject,
  persistLastRevisionNumbersPulled,
} from './lastRevisionNumbers'
import { getAuthorizationHeaders } from '../../library/getAuthorizationHeaders'

const resetPushToApiTagFromItems = (items) =>
  items.map((item) => ({ ...item, uiState_pushToApi: false }))

const isIndexedDBProjectInProjectResults = (indexedDBProject, projectsResults) =>
  projectsResults.some((responseProject) => indexedDBProject.id === responseProject.id)

export const pullApiData = async ({
  apiBaseUrl,
  apiDataNamesToPull,
  dexiePerUserDataInstance,
  getAccessToken,
  projectId,
}) => {
  if (!getAccessToken || !apiBaseUrl || !apiDataNamesToPull || !dexiePerUserDataInstance) {
    throw new Error('pullApiData is missing a required parameter')
  }
  const lastRevisionNumbersPulled = await getLastRevisionNumbersPulledForAProject({
    dexiePerUserDataInstance,
    projectId,
  })

  const pullRequestBody = apiDataNamesToPull.reduce(
    (accumulator, apiDataName) => ({
      ...accumulator,
      [apiDataName]: {
        last_revision: lastRevisionNumbersPulled?.[apiDataName] ?? null,
        project: projectId ?? null,
      },
    }),
    {},
  )

  const pullResponse = await axios.post(
    `${apiBaseUrl}/pull/`,
    pullRequestBody,
    await getAuthorizationHeaders(getAccessToken),
  )

  // If projects are part of the API pull determine if the user has been
  // removed from a project. This is determined later in this function.
  // If the user has been removed, the project will be removed from the IndexedDB.
  const projectsResponse = apiDataNamesToPull.includes('projects')
    ? await axios.get(`${apiBaseUrl}/projects/`, await getAuthorizationHeaders(getAccessToken))
    : undefined
  const indexedDbProjects = await dexiePerUserDataInstance.projects.toArray()

  const apiData = pullResponse.data

  await dexiePerUserDataInstance.transaction(
    'rw',
    dexiePerUserDataInstance.benthic_attributes,
    dexiePerUserDataInstance.choices,
    dexiePerUserDataInstance.collect_records,
    dexiePerUserDataInstance.fish_families,
    dexiePerUserDataInstance.fish_genera,
    dexiePerUserDataInstance.fish_species,
    dexiePerUserDataInstance.project_managements,
    dexiePerUserDataInstance.project_profiles,
    dexiePerUserDataInstance.project_sites,
    dexiePerUserDataInstance.projects,
    dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled,
    async () => {
      persistLastRevisionNumbersPulled({
        dexiePerUserDataInstance,
        apiData,
        projectId,
      })

      apiDataNamesToPull.forEach((apiDataType) => {
        if (apiDataType === 'choices') {
          // choices deletes property will always be empty, so we just ignore it
          // additionally the updates property is an object, not an array, so we just store it directly

          dexiePerUserDataInstance.choices.put({
            id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
            choices: { ...apiData.choices?.updates, uiState_pushToApi: false },
          })
        }
        if (apiDataType !== 'choices') {
          const updates = apiData[apiDataType]?.updates ?? []
          const updatesWithPushToApiTagReset = resetPushToApiTagFromItems(updates)
          const deletes = apiData[apiDataType]?.deletes ?? []
          const deleteIds = deletes.map(({ id }) => id)
          const error = apiData[apiDataType]?.error
          const errorIds = error && [401, 403].includes(error.code) ? error.record_ids : []

          // Use Set to remove duplicates
          const bulkDeleteIds = Array.from(new Set([...deleteIds, ...errorIds]))

          dexiePerUserDataInstance[apiDataType].bulkPut(updatesWithPushToApiTagReset)
          dexiePerUserDataInstance[apiDataType].bulkDelete(bulkDeleteIds)
        }

        // If the user has been removed from a project, the backend does not treat
        // it as a change to the project itself, therefore no revision is triggered.
        // Only the project profile changes in this case.
        // If the user remains online, project profile will not be updated by a pull.
        // Determine if the user's project membership has changed based on the
        // /projects endpoint response and delete the project in the IndexedDb if
        // they have been removed.
        if (projectsResponse && apiDataType === 'projects') {
          const projectsResults = projectsResponse.data?.results

          // Determine which projects in IndexedDB are not in the /projects API response
          const deleteProjectIds = indexedDbProjects
            .filter(
              (indexedDBProject) =>
                !isIndexedDBProjectInProjectResults(indexedDBProject, projectsResults),
            )
            .map((removedProject) => removedProject.id)

          if (deleteProjectIds.length) {
            // Delete the projects from IndexedDB as the user has been removed from them
            dexiePerUserDataInstance.projects.bulkDelete(deleteProjectIds)
          }
        }
      })
    },
  )

  return pullResponse
}
