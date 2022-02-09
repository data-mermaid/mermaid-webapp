import axios from 'axios'
import language from '../language'

const getCurrentUserProfile = ({
  apiBaseUrl,
  getAccessToken,
  dexieInstance,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  if (!apiBaseUrl) {
    throw new Error('getCurrentUserProfile needs an API base url')
  }
  if (!dexieInstance) {
    throw new Error('getCurrentUserProfile needs a dexieInstance')
  }

  let currentToken

  getAccessToken().then((token) => {
    currentToken = token
  })

  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndLoading =
    //   isAuthenticatedAndReady && isAppOnline && !currentToken
    // const isOnlineAuthenticatedAndReady =
    //   isAuthenticatedAndReady && isAppOnline && !!currentToken
    isAuthenticatedAndReady && isAppOnline
  const isOnlineAuthenticatedAndReady = isAuthenticatedAndReady && isAppOnline
  const isOfflineAuthenticatedAndReady = isAuthenticatedAndReady && !isAppOnline

  if (isOnlineAuthenticatedAndLoading) {
    return Promise.resolve(undefined)
  }

  if (isOnlineAuthenticatedAndReady) {
    let token

    this._getAccessToken().then((newToken) => {
      token = newToken
    })

    return axios
      .get(`${apiBaseUrl}/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((apiResults) => {
        const userFromApi = apiResults.data

        if (!userFromApi) {
          throw Error('User Profile not returned from API')
        }

        const userToStore = {
          id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
          user: userFromApi,
        }

        return dexieInstance.uiState_currentUser.put(userToStore).then(() => userFromApi)
      })
  }
  if (isOfflineAuthenticatedAndReady) {
    return dexieInstance.uiState_currentUser.toArray().then((results) => {
      const { user } = results[0]

      if (!user) {
        throw Error('User Profile not returned from offline storage')
      }

      return user
    })
  }

  return Promise.reject(new Error(language.error.appNotAuthenticatedOrReady))
}

export default getCurrentUserProfile
