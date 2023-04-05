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
  handleUserDeniedSyncPull,
}) => {
  if (
    !apiBaseUrl ||
    !apiDataNamesToPull ||
    !dexiePerUserDataInstance ||
    !getAccessToken ||
    !handleUserDeniedSyncPull
  ) {
    throw new Error('pullApiData is missing a required parameter')
  }

  let shouldHandleUserDeniedSyncPull = false

  let shouldRemoveProjectFromOfflineReadyList = false
  /* we set the projectName to use as a parameter for handleUserDeniedSyncPull here,
   because from information that will likely be deleted with the `removes` array
   in the pullResponse further on down and before we call the handleUserDeniedSyncPull callback */
  const projectName = projectId
    ? (await dexiePerUserDataInstance.projects.get(projectId))?.name
    : null

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

  const _evaluatePullResponseAndUpdateOfflineMermaidDataAccordingly =
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
            const is401 = error?.code === 401
            const is403 = error?.code === 403

            if (is403) {
              shouldHandleUserDeniedSyncPull = true
            }

            const isDataTypeProjectAssociated = getIsDataTypeProjectAssociated(apiDataType)

            const bulkDeleteIdsWithNoDuplicates = Array.from(new Set([...deleteIds, ...removeIds]))

            dexiePerUserDataInstance[apiDataType].bulkPut(updatesWithPushToApiTagReset)
            dexiePerUserDataInstance[apiDataType].bulkDelete(bulkDeleteIdsWithNoDuplicates)

            if ((is401 || is403) && isDataTypeProjectAssociated && projectId) {
              // we still delete project related data in addition to anything in the removes array,
              // because the removes array response doesnt include all the things we want to delete currently.

              // we dont delete the project from the offline ready list yet. We
              // want to wait until we have possibly redirected to a route that doesnt
              // just cause the project to be added back to the offline ready list
              // which project-specific routes/pages will do. The redirection happens
              // when we call handleUserDeniedSyncPull below. After that is called, we
              // the project from being in the offline-ready list
              shouldRemoveProjectFromOfflineReadyList = true
              const deleteProjectRelatedRecords = dexiePerUserDataInstance[apiDataType]
                .where({ project: projectId })
                .delete()
              const resetProjectRelatedLastRevisionNumbers =
                resetLastRevisionNumberForProjectDataType({
                  dataType: apiDataType,
                  projectId,
                  dexiePerUserDataInstance,
                })

              await Promise.all([
                deleteProjectRelatedRecords,
                resetProjectRelatedLastRevisionNumbers,
              ])
            }
          }
        })

        if (shouldHandleUserDeniedSyncPull && projectId && projectName) {
          /* user will only be denied pulling when they are trying to
           pull from a entity where there will also be a projectId
           as part of the pull request, which we need to determine projectName
           we do that at the beginning of the pullApiData funciton instead of down here,
           because by the time we get to this block, the project info with its project name are
           likely to have already been deleted with the content of the removes array */

          handleUserDeniedSyncPull(projectName)
        }
        if (shouldRemoveProjectFromOfflineReadyList && projectId) {
          /* we wait to delete the project from being considered offline ready
           until after we call handleUserDeniedSyncPull which involves a redirect away from the
           a project specific page (crudly using a setTimeout). This is because if the app
           is on a project-specific page, it automatically sets the project as offline-ready
           (as a business feature), we need to ensure that the redirect
           to happen first so that us deleting the project from being offline - ready persists.
           We want to avoid the project just being reset as offline-ready
           immediately after we remove it from the offline-ready list of projects.
           This pollutes this pull logic and module with some dependence
           on the UI code and routing logic. */

          setTimeout(async () => {
            await dexiePerUserDataInstance.uiState_offlineReadyProjects.delete(projectId)
          }, 1500)
        }
      },
    )

  return pullResponse
}
