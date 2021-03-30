import axios from 'axios'
import PropTypes from 'prop-types'
import language from '../../../language'

import mockMermaidData from '../../../testUtilities/mockMermaidData'

class DatabaseSwitchboard {
  #apiBaseUrl

  #authenticatedAxios

  #isAuthenticatedAndReady

  #isOfflineAuthenticatedAndReady

  #isOnlineAuthenticatedAndLoading

  #isOnlineAuthenticatedAndReady

  #dexieInstance

  #notAuthenticatedAndReadyError = new Error(
    language.error.appNotAuthenticatedOrReady,
  )

  constructor({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated,
    isOnline,
    dexieInstance,
  }) {
    this.#apiBaseUrl = apiBaseUrl
    this.#dexieInstance = dexieInstance
    this.#isAuthenticatedAndReady = isMermaidAuthenticated && !!dexieInstance
    this.#authenticatedAxios = auth0Token
      ? axios.create({
          headers: {
            Authorization: `Bearer ${auth0Token}`,
          },
        })
      : undefined
    this.#isOnlineAuthenticatedAndReady =
      this.#isAuthenticatedAndReady && isOnline && !!this.#authenticatedAxios
    this.#isOnlineAuthenticatedAndLoading =
      this.#isAuthenticatedAndReady && isOnline && !this.#authenticatedAxios
    this.#isOfflineAuthenticatedAndReady =
      this.#isAuthenticatedAndReady && !isOnline
  }

  getCollectRecord = (id) =>
    this.#isAuthenticatedAndReady
      ? this.getCollectRecords().then((records) =>
          records.find((record) => record.id === id),
        )
      : Promise.reject(this.#notAuthenticatedAndReadyError)

  getCollectRecordMethodLabel = (protocol) => {
    switch (protocol) {
      default:
        return 'Unknown Method'
      case 'fishbelt':
        return 'Fish Belt'
      case 'benthiclit':
        return 'Benthic LIT'
      case 'benthicpit':
        return 'Benthic PIT'
      case 'habitatcomplexity':
        return 'Habitat Complexity'
      case 'bleachingqc':
        return 'Bleaching'
    }
  }

  getCollectRecords = () =>
    this.#isAuthenticatedAndReady
      ? Promise.resolve(mockMermaidData.collectRecords)
      : Promise.reject(this.#notAuthenticatedAndReadyError)

  getCollectRecordsForUIDisplay = () => {
    return this.#isAuthenticatedAndReady
      ? Promise.all([
          this.getCollectRecords(),
          this.getSites(),
          this.getManagementRegimes(),
        ]).then(([collectRecords, sites, managementRegimes]) => {
          const getSiteLabel = (searchId) =>
            sites.find((site) => site.id === searchId).name

          const getManagementRegimeLabel = (searchId) =>
            managementRegimes.find((regime) => regime.id === searchId).name

          return collectRecords.map((record) => ({
            ...record,
            uiLabels: {
              site: getSiteLabel(record.data.sample_event.site),
              management: getManagementRegimeLabel(
                record.data.sample_event.management,
              ),
              protocol: this.getCollectRecordMethodLabel(record.data.protocol),
            },
          }))
        })
      : Promise.reject(this.#notAuthenticatedAndReadyError)
  }

  getManagementRegimes = () =>
    this.#isAuthenticatedAndReady
      ? Promise.resolve(mockMermaidData.managementRegimes)
      : Promise.reject(this.#notAuthenticatedAndReadyError)

  getProjects = () =>
    this.#isAuthenticatedAndReady
      ? Promise.resolve(mockMermaidData.projects)
      : Promise.reject(this.#notAuthenticatedAndReadyError)

  getSites = () =>
    this.#isAuthenticatedAndReady
      ? Promise.resolve(mockMermaidData.sites)
      : Promise.reject(this.#notAuthenticatedAndReadyError)

  getChoices = () =>
    this.#isAuthenticatedAndReady
      ? Promise.resolve(mockMermaidData.choices)
      : Promise.reject(this.#notAuthenticatedAndReadyError)

  getUserProfile = () => {
    if (this.#isOnlineAuthenticatedAndLoading) {
      return Promise.resolve(undefined)
    }
    if (this.#isOnlineAuthenticatedAndReady) {
      return this.#authenticatedAxios
        .get(`${this.#apiBaseUrl}/me`)
        .then((apiResults) => {
          const user = apiResults.data

          if (!user) {
            throw Error('User Profile not returned from API')
          }

          return this.#dexieInstance.currentUser.put(user).then(() => user)
        })
    }
    if (this.#isOfflineAuthenticatedAndReady) {
      return this.#dexieInstance.currentUser.toArray().then((results) => {
        const user = results[0]

        if (!user) {
          throw Error('User Profile not returned from offline storage')
        }

        return user
      })
    }

    return Promise.reject(this.#notAuthenticatedAndReadyError)
  }
}

const databaseSwitchboardPropTypes = PropTypes.shape({
  getCollectRecord: PropTypes.func,
  getCollectRecordMethodLabel: PropTypes.func,
  getCollectRecords: PropTypes.func,
  getCollectRecordsForUIDisplay: PropTypes.func,
  getManagementRegimes: PropTypes.func,
  getProjects: PropTypes.func,
  getSites: PropTypes.func,
  getChoices: PropTypes.func,
  getUserProfile: PropTypes.func,
})

export default DatabaseSwitchboard
export { databaseSwitchboardPropTypes }
