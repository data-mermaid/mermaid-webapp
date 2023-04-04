import axios from '../../library/axiosRetry'
import {
  getLastRevisionNumbersPulledForAProject,
  persistLastRevisionNumbersPulled,
  resetLastRevisionNumberForProjectDataType,
} from './lastRevisionNumbers'
import { getAuthorizationHeaders } from '../../library/getAuthorizationHeaders'
import { getIsDataTypeProjectAssociated } from './getIsDataTypeProjectAssociated'

const resetPushToApiTagFromItems = (items) =>
  items.map((item) => ({ ...item, uiState_pushToApi: false }))

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
    dexiePerUserDataInstance.uiState_offlineReadyProjects,
    async () => {
      await persistLastRevisionNumbersPulled({
        dexiePerUserDataInstance,
        apiData,
        projectId,
      })

      apiDataNamesToPull.forEach(async (apiDataType) => {
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
          const removes = apiData[apiDataType]?.removes ?? []
          const deleteIds = deletes.map(({ id }) => id)
          const removeIds = removes.map(({ id }) => id)
          const error = apiData[apiDataType]?.error
          const is401Or403 = error && [401, 403].includes(error.code)

          const isDataTypeProjectAssociated = getIsDataTypeProjectAssociated(apiDataType)

          const bulkDeleteIdsWithNoDuplicates = Array.from(new Set([...deleteIds, ...removeIds]))

          dexiePerUserDataInstance[apiDataType].bulkPut(updatesWithPushToApiTagReset)
          dexiePerUserDataInstance[apiDataType].bulkDelete(bulkDeleteIdsWithNoDuplicates)

          if (is401Or403 && isDataTypeProjectAssociated && projectId) {
            // we still delete project related data in addition to anything in the removes array,
            // because the removes array response doesnt include all the things we want to delete currently.
            const deleteProjectRelatedRecords = dexiePerUserDataInstance[apiDataType]
              .where({ project: projectId })
              .delete()
            const resetProjectRelatedLastRevisionNumbers =
              resetLastRevisionNumberForProjectDataType({
                dataType: apiDataType,
                projectId,
                dexiePerUserDataInstance,
              })

            const removeOfflineReadyProjectStatus =
              dexiePerUserDataInstance.uiState_offlineReadyProjects.delete(projectId)

            await Promise.all([
              deleteProjectRelatedRecords,
              resetProjectRelatedLastRevisionNumbers,
              removeOfflineReadyProjectStatus,
            ])
          }
        }
      })
    },
  )

  return pullResponse
}
