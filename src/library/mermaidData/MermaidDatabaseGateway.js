import axios from 'axios'

class MermaidDatabaseGateway {
  static getCollectRecordMethodLabel = (protocol) => {
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

  #apiBaseUrl

  #authenticatedAxios

  #isOfflineAuthenticatedAndReady

  #isOnlineAuthenticatedAndReady

  #mermaidDbAccessInstance

  constructor({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated,
    isOnline,
    mermaidDbAccessInstance,
  }) {
    this.#apiBaseUrl = apiBaseUrl
    this.#mermaidDbAccessInstance = mermaidDbAccessInstance
    this.#isOnlineAuthenticatedAndReady =
      isMermaidAuthenticated &&
      isOnline &&
      !!auth0Token &&
      !!mermaidDbAccessInstance

    this.#isOfflineAuthenticatedAndReady =
      isMermaidAuthenticated && !isOnline && !!mermaidDbAccessInstance

    this.#authenticatedAxios = auth0Token
      ? axios.create({
          headers: {
            Authorization: `Bearer ${auth0Token}`,
          },
        })
      : undefined
  }

  getUserProfile = () => {
    if (this.#isOnlineAuthenticatedAndReady) {
      return this.#authenticatedAxios
        .get(`${this.#apiBaseUrl}/me`)
        .then((apiResults) => {
          const user = apiResults.data

          if (!user) {
            throw Error('User Profile not returned from API')
          }

          return this.#mermaidDbAccessInstance.currentUser
            .put(user)
            .then(() => user)
        })
    }
    if (this.#isOfflineAuthenticatedAndReady) {
      return this.#mermaidDbAccessInstance.currentUser
        .toArray()
        .then((results) => {
          const user = results[0]

          if (!user) {
            throw Error('User Profile not returned from offline storage')
          }

          return user
        })
    }

    return Promise.reject(new Error('fail'))
  }
}

export default MermaidDatabaseGateway
