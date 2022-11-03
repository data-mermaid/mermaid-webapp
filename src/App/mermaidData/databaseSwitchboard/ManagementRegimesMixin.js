import axios from 'axios'
import { createUuid } from '../../../library/createUuid'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { getSampleUnitLabel } from '../getSampleUnitLabel'

const ManagementRegimesMixin = (Base) =>
  class extends Base {
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

    getManagementRegimesExcludedInCurrentProject =
      async function getManagementRegimesExcludedInCurrentProject(projectId) {
        if (!projectId) {
          return Promise.reject(this._operationMissingParameterError)
        }

        return this._isOnlineAuthenticatedAndReady
          ? axios
              .get(`${this._apiBaseUrl}/managements/`, {
                params: {
                  exclude_projects: projectId,
                  include_fields: `project_name`,
                  unique: projectId,
                  limit: 10000,
                },
                ...(await getAuthorizationHeaders(this._getAccessToken)),
              })
              .then((apiResults) => apiResults.data)
          : Promise.reject(this._notAuthenticatedAndReadyError)
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
          .then((response) => {
            const [managementRegimeResponseFromApiPush] = response.data.project_managements
            const projectManagementsErrorData = managementRegimeResponseFromApiPush.data

            const isManagementRegimeStatusCodeSuccessful = this._isStatusCodeSuccessful(
              managementRegimeResponseFromApiPush.status_code,
            )

            if (isManagementRegimeStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then((_dataSetsReturnedFromApiPull) => {
                  const managementRegimeWithExtraPropertiesWrittenByApi =
                    managementRegimeResponseFromApiPush.data

                  return managementRegimeWithExtraPropertiesWrittenByApi
                })
            }

            return Promise.reject(projectManagementsErrorData)
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.project_managements
          .put(managementToSubmit)
          .then(() => managementToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteManagementRegime = async function deleteManagementRegime(record, projectId) {
      if (!record) {
        throw new Error('deleteSite expects record, profileId, and projectId parameters')
      }

      const hasCorrespondingRecordInTheApi = !!record._last_revision_num

      const recordMarkedToBeDeleted = {
        ...record,
        _deleted: true,
        uiState_pushToApi: true,
      }

      if (hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.project_sites.put(recordMarkedToBeDeleted)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              project_managements: [recordMarkedToBeDeleted],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((apiPushResponse) => {
            const recordReturnedFromApiPush = apiPushResponse.data.project_managements[0]
            const isRecordStatusCodeSuccessful = this._isStatusCodeSuccessful(
              recordReturnedFromApiPush.status_code,
            )

            const { sampleevent, ...sampleUnitProtocols } = recordReturnedFromApiPush.data // eslint-disable-line no-unused-vars

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then((_apiPullResponse) => apiPushResponse)
            }

            const sampleUnitProtocolValues = Object.values(sampleUnitProtocols).flat()
            const sampleUnitProtocolLabels = getSampleUnitLabel(sampleUnitProtocolValues)

            return Promise.reject(sampleUnitProtocolLabels)
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ManagementRegimesMixin
