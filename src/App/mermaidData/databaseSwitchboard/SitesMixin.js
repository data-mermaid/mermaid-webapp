import { createUuid } from '../../../library/createUuid'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import axios from '../../../library/axiosRetry'
import i18n from '../../../../i18n'
import { DEFAULT_RECORDS_PER_PAGE } from '../../../library/constants/constants'

const SitesMixin = (Base) =>
  (class extends Base {
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

    getSitesFromApi = async function getManagementRegimesFromApi(projectId, pageNo) {
      if (!projectId) {
        return Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/sites/`, {
              params: {
                exclude_projects: projectId,
                include_fields: `country_name,project_name,reef_type_name,reef_zone_name,exposure_name`,
                page: pageNo,
                limit: DEFAULT_RECORDS_PER_PAGE,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSitesExcludedInCurrentProjectByPage = async function getSitesExcludedInCurrentProjectByPage(
      projectId,
      pageNo = 1,
    ) {
      const apiResultData = await this.getSitesFromApi(projectId, pageNo)
      const { results, count: totalRecordsCount } = apiResultData
      const totalPages = Math.ceil(totalRecordsCount / DEFAULT_RECORDS_PER_PAGE)

      if (pageNo < totalPages) {
        return [...results].concat(
          await this.getSitesExcludedInCurrentProjectByPage(projectId, pageNo + 1),
        )
      }

      return results
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
          .then((pushResponse) => {
            const [siteResponseFromApiPush] = pushResponse.data.project_sites

            const isSiteStatusCodeSuccessful = this._isStatusCodeSuccessful(
              siteResponseFromApiPush.status_code,
            )

            if (isSiteStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  const siteWithExtraPropertiesWrittenByApi = siteResponseFromApiPush.data

                  return siteWithExtraPropertiesWrittenByApi
                })
            }

            if (!isSiteStatusCodeSuccessful) {
              return Promise.reject(
                this._getMermaidDataPushSyncStatusCodeError({
                  mermaidDataTypeName: 'project_sites',
                  pushResponse,
                }),
              )
            }

            return Promise.reject(new Error(i18n.t('api_errors.mermaid_error')))
          })
      }

      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.project_sites
          .put(siteToSubmit)
          .then(() => siteToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteSite = async function deleteSite(originalSiteToBeDeleted, projectId) {
      if (!originalSiteToBeDeleted && !projectId) {
        throw new Error(
          'deleteSite expects originalSiteToBeDeleted, profileId, and projectId parameters',
        )
      }

      const hasCorrespondingSiteInTheApi = !!originalSiteToBeDeleted._last_revision_num

      const siteCopyMarkedToBeDeleted = {
        ...originalSiteToBeDeleted,
        _deleted: true,
        uiState_pushToApi: true,
      }

      if (hasCorrespondingSiteInTheApi && this._isOnlineAuthenticatedAndReady) {
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.project_sites.put(siteCopyMarkedToBeDeleted)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              project_sites: [siteCopyMarkedToBeDeleted],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((pushResponse) => {
            const siteReturnedFromApiPush = pushResponse.data.project_sites[0]
            const isStatusCodeSuccessful = this._isStatusCodeSuccessful(
              siteReturnedFromApiPush.status_code,
            )

            if (isStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => pushResponse)
            }

            if (!isStatusCodeSuccessful) {
              const syncError = this._getMermaidDataPushSyncStatusCodeError({
                mermaidDataTypeName: 'project_sites',
                pushResponse,
              })

              if (syncError.isDeleteRejectedError) {
                // not awaiting this because its not the end of the world if
                // this doesnt get rolled back to the original(it just means
                //  the next push will try again unecessarily)
                this._dexiePerUserDataInstance.project_sites.put(originalSiteToBeDeleted)
              }

              return Promise.reject(syncError)
            }

            return Promise.reject(new Error(i18n.t('api_errors.mermaid_error')))
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
        throw new Error(
          'findAndReplaceSite expects record, findRecordId, and replaceRecordId parameters',
        )
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
  })

export default SitesMixin
