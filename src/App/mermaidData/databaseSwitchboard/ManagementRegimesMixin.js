import language from '../../../language'
import axios from '../../../library/axiosRetry'
import { createUuid } from '../../../library/createUuid'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { DEFAULT_RECORDS_PER_PAGE } from '../../../library/constants/constants'

const ManagementRegimesMixin = (Base) =>
  (class extends Base {
    #getManagementRegimeReadyForPush = function getManagementRegimeReadyForPush({
      managementRegime,
      projectId,
    }) {
      const idToSubmit = managementRegime.id ?? createUuid()
      const projectIdToSubmit = managementRegime.project ?? projectId

      return {
        ...managementRegime,
        id: idToSubmit,
        project: projectIdToSubmit,
        uiState_pushToApi: true,
      }
    }

    getManagementRegimesWithoutOfflineDeleted = function getManagementRegimesWithoutOfflineDeleted(
      projectId,
    ) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.project_managements
            .toArray()
            .then((managementRegimes) =>
              managementRegimes.filter(
                (managementRegime) =>
                  managementRegime.project === projectId && !managementRegime._deleted,
              ),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegimesFromApi = async function getManagementRegimesFromApi(projectId, pageNo) {
      if (!projectId) {
        return Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/managements/`, {
              params: {
                exclude_projects: projectId,
                include_fields: `project_name`,
                page: pageNo,
                limit: DEFAULT_RECORDS_PER_PAGE,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegimesExcludedInCurrentProjectByPage =
      async function getManagementRegimesExcludedInCurrentProjectByPage(projectId, pageNo = 1) {
        const apiResultData = await this.getManagementRegimesFromApi(projectId, pageNo)
        const { results, count: totalRecordsCount } = apiResultData
        const totalPages = Math.ceil(totalRecordsCount / DEFAULT_RECORDS_PER_PAGE)

        if (pageNo < totalPages) {
          return [...results].concat(
            await this.getManagementRegimesExcludedInCurrentProjectByPage(projectId, pageNo + 1),
          )
        }

        return results
      }

    copyManagementRegimesToProject = async function copyManagementRegimesToProject(
      projectId,
      originalIds,
    ) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/${projectId}/managements/copy/`,
            {
              original_ids: originalIds,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(
              new Error(
                'the API site returned from copySitesToProject does not have a successful status code',
              ),
            )
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegime = function getManagementRegime(id) {
      if (!id) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexiePerUserDataInstance.project_managements.get(id)
    }

    getManagementRegimeRecordsForUiDisplay = function getManagementRegimeRecordsForUiDisplay(
      projectId,
    ) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getManagementRegimesWithoutOfflineDeleted(projectId).then((managementRegimes) => {
            return managementRegimes.map((record) => record)
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    saveManagementRegime = async function saveManagementRegime({ managementRegime, projectId }) {
      if (!managementRegime || !projectId) {
        throw new Error('saveManagementRegime expects record and projectId parameters')
      }

      const managementToSubmit = this.#getManagementRegimeReadyForPush({
        managementRegime,
        projectId,
      })

      if (this._isOnlineAuthenticatedAndReady) {
        await this._dexiePerUserDataInstance.project_managements.put(managementToSubmit)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              project_managements: [managementToSubmit],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((pushResponse) => {
            const [managementRegimeResponseFromApiPush] = pushResponse.data.project_managements

            const isManagementRegimeStatusCodeSuccessful = this._isStatusCodeSuccessful(
              managementRegimeResponseFromApiPush.status_code,
            )

            if (isManagementRegimeStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  const managementRegimeWithExtraPropertiesWrittenByApi =
                    managementRegimeResponseFromApiPush.data

                  return managementRegimeWithExtraPropertiesWrittenByApi
                })
            }

            if (!isManagementRegimeStatusCodeSuccessful) {
              return Promise.reject(
                this._getMermaidDataPushSyncStatusCodeError({
                  mermaidDataTypeName: 'project_managements',
                  pushResponse,
                }),
              )
            }

            return Promise.reject(new Error(language.error.generic))
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.project_managements
          .put(managementToSubmit)
          .then(() => managementToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteManagementRegime = async function deleteManagementRegime(
      originalManagementRegimeToBeDeleted,
      projectId,
    ) {
      if (!originalManagementRegimeToBeDeleted && !projectId) {
        throw new Error(
          'deleteManagementRegime expects originalManagementRegimeToBeDeleted, and projectId parameters',
        )
      }

      const hasCorrespondingManagementRegimeInTheApi =
        !!originalManagementRegimeToBeDeleted._last_revision_num

      const managementRegimeCopyMarkedToBeDeleted = {
        ...originalManagementRegimeToBeDeleted,
        _deleted: true,
        uiState_pushToApi: true,
      }

      if (hasCorrespondingManagementRegimeInTheApi && this._isOnlineAuthenticatedAndReady) {
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.project_managements.put(
          managementRegimeCopyMarkedToBeDeleted,
        )

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              project_managements: [managementRegimeCopyMarkedToBeDeleted],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((pushResponse) => {
            const managementRegimeReturnedFromApiPush = pushResponse.data.project_managements[0]
            const statusCode = managementRegimeReturnedFromApiPush.status_code
            const isStatusCodeSuccessful = this._isStatusCodeSuccessful(statusCode)

            if (isStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => pushResponse)
            }

            if (!isStatusCodeSuccessful) {
              const syncError = this._getMermaidDataPushSyncStatusCodeError({
                mermaidDataTypeName: 'project_managements',
                pushResponse,
              })

              if (syncError.isDeleteRejectedError) {
                // not awaiting this because its not the end of the world if this doesnt get rolled back to the original (it just meant the next push will try again unecessarily)
                this._dexiePerUserDataInstance.project_managements.put(
                  originalManagementRegimeToBeDeleted,
                )
              }

              return Promise.reject(syncError)
            }

            return Promise.reject(new Error(language.error.generic))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    findAndReplaceManagementRegime = async function findAndReplaceManagementRegime(
      projectId,
      findRecordId,
      replaceRecordId,
    ) {
      if (!projectId || !findRecordId || !replaceRecordId) {
        throw new Error(
          'findAndReplaceManagementRegime expects projectId, findRecordId, and replaceRecordId parameters',
        )
      }

      if (this._isOnlineAuthenticatedAndReady) {
        return axios
          .put(
            `${this._apiBaseUrl}/projects/${projectId}/find_and_replace_managements/`,
            {
              find: [findRecordId],
              replace: replaceRecordId,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then(() => {
            return this._apiSyncInstance.pushThenPullAllProjectDataExceptChoices(projectId)
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  })

export default ManagementRegimesMixin
