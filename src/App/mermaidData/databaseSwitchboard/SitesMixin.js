import axios from 'axios'
import { createUuid } from '../../../library/createUuid'
import { getObjectById } from '../../../library/getObjectById'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

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

    getSitesTest = async function getSitesTest(projectId, pageNo = 1, orderingTerms) {
      if (!projectId) {
        return Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/sites/`, {
              params: {
                exclude_projects: projectId,
                include_fields: `country_name,project_name,reef_type_name,reef_zone_name,exposure_name`,
                ordering: orderingTerms,
                unique: projectId,
                limit: 5,
                page: pageNo,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
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
        ? Promise.all([this.getSitesWithoutOfflineDeleted(projectId), this.getChoices()]).then(
            ([sites, choices]) => {
              const { reeftypes, reefzones, reefexposures } = choices

              return sites.map((record) => {
                return {
                  ...record,
                  uiLabels: {
                    name: record.name,
                    reefType: getObjectById(reeftypes.data, record.reef_type).name,
                    reefZone: getObjectById(reefzones.data, record.reef_zone).name,
                    exposure: getObjectById(reefexposures.data, record.exposure).name,
                  },
                }
              })
            },
          )
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

            return Promise.reject(
              new Error('the API site returned from saveSite doesnt have a successful status code'),
            )
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.project_sites
          .put(siteToSubmit)
          .then(() => siteToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SitesMixin
