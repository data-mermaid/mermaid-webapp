import axios from 'axios'
import { createUuid } from '../../../library/createUuid'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { getSampleUnitLabel } from '../getSampleUnitLabel'

const SitesMixin = (Base) =>
  class extends Base {
    #getSiteReadyForPush = function getSiteReadyForPush({ site, projectId }) {
      const idToSubmit = site.id ?? createUuid()
      const projectIdToSubmit = site.project ?? projectId

      return {
        ...site,
        id: idToSubmit,
        project: projectIdToSubmit,
        uiState_pushToApi: true,
      }
    }

    getSitesWithoutOfflineDeleted = async function getSitesWithoutOfflineDeleted(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.project_sites
            .toArray()
            .then((sites) => sites.filter((site) => site.project === projectId && !site._deleted))
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSitesExcludedInCurrentProject = async function getSitesExcludedInCurrentProject(projectId) {
      if (!projectId) {
        return Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/sites/`, {
              params: {
                exclude_projects: projectId,
                include_fields: `country_name,project_name,reef_type_name,reef_zone_name,exposure_name`,
                limit: 10000,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    copySitesToProject = async function copySitesToProject(projectId, originalIds) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/${projectId}/sites/copy/`,
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

    getSite = function getSite(id) {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexiePerUserDataInstance.project_sites.get(id)
    }

    getSiteRecordsForUIDisplay = function getSiteRecordsForUIDisplay(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSitesWithoutOfflineDeleted(projectId).then((sites) => {
            return sites.map((record) => record)
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    saveSite = async function saveSite({ site, projectId }) {
      if (!site || !projectId) {
        throw new Error('saveSite expects record and projectId parameters')
      }

      const siteToSubmit = this.#getSiteReadyForPush({ site, projectId })

      if (this._isOnlineAuthenticatedAndReady) {
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.project_sites.put(siteToSubmit)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              project_sites: [siteToSubmit],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((response) => {
            const [siteResponseFromApiPush] = response.data.project_sites
            const projectSitesErrorData = siteResponseFromApiPush.data

            const isSiteStatusCodeSuccessful = this._isStatusCodeSuccessful(
              siteResponseFromApiPush.status_code,
            )

            if (isSiteStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then((_dataSetsReturnedFromApiPull) => {
                  const siteWithExtraPropertiesWrittenByApi = siteResponseFromApiPush.data

                  return siteWithExtraPropertiesWrittenByApi
                })
            }

            return Promise.reject(projectSitesErrorData)
          })
      }

      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.project_sites
          .put(siteToSubmit)
          .then(() => siteToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteSite = async function deleteSite(record, projectId) {
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
              project_sites: [recordMarkedToBeDeleted],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((apiPushResponse) => {
            const recordReturnedFromApiPush = apiPushResponse.data.project_sites[0]
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

    findAndReplaceSite = async function findAndReplaceSite(
      projectId,
      findRecordId,
      replaceRecordId,
    ) {
      if (!projectId || !findRecordId || !replaceRecordId) {
        throw new Error('deleteSite expects record, profileId, and projectId parameters')
      }

      if (this._isOnlineAuthenticatedAndReady) {
        return axios
          .put(
            `${this._apiBaseUrl}/projects/${projectId}/find_and_replace_sites/`,
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
  }

export default SitesMixin
