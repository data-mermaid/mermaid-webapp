import axios from 'axios'
import language from '../language'

const getUserProfile = ({
  apiBaseUrl,
  auth0Token,
  dexieInstance,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  if (!apiBaseUrl) {
    throw new Error('getUserProfile needs an API base url')
  }
  if (!dexieInstance) {
    throw new Error('getUserProfile needs a dexieInstance')
  }
  const authenticatedAxios = auth0Token
    ? axios.create({
        headers: {
          Authorization: `Bearer ${auth0Token}`,
        },
      })
    : undefined
  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndLoading =
    isAuthenticatedAndReady && isAppOnline && !authenticatedAxios
  const isOnlineAuthenticatedAndReady =
    isAuthenticatedAndReady && isAppOnline && !!authenticatedAxios
  const isOfflineAuthenticatedAndReady = isAuthenticatedAndReady && !isAppOnline

  if (isOnlineAuthenticatedAndLoading) {
    return Promise.resolve(undefined)
  }

  if (isOnlineAuthenticatedAndReady) {
    return authenticatedAxios.get(`${apiBaseUrl}/me`).then((apiResults) => {
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

export default getUserProfile
