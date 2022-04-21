import axios from 'axios'
import language from '../language'
import { getAuthorizationHeaders } from '../library/getAuthorizationHeaders'

const getUserName = (user) => {
  const { first_name, last_name, email } = user
  const emailName = email.match(/^.+(?=@)/)[0]

  if (first_name.length && last_name.length) {
    return `${first_name} ${last_name}`
  }

  if (first_name.length) {
    return first_name
  }

  if (last_name.length) {
    return last_name
  }

  return emailName
}

export const getCurrentUserProfile = async ({
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

  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndReady = isAuthenticatedAndReady && isAppOnline

  const isOfflineAuthenticatedAndReady = isAuthenticatedAndReady && !isAppOnline

  if (isOnlineAuthenticatedAndReady) {
    return axios
      .get(`${apiBaseUrl}/me/`, await getAuthorizationHeaders(getAccessToken))
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

export const updateCurrentUserProfile = async ({
  apiBaseUrl,
  getAccessToken,
  dexieInstance,
  isMermaidAuthenticated,
  isAppOnline,
  userProfile,
}) => {
  if (!apiBaseUrl) {
    throw new Error('updateCurrentUserProfile needs an API base url')
  }
  if (!dexieInstance) {
    throw new Error('updateCurrentUserProfile needs a dexieInstance')
  }

  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndReady = isAuthenticatedAndReady && isAppOnline

  if (isOnlineAuthenticatedAndReady) {
    return axios
      .put(`${apiBaseUrl}/me/`, userProfile, await getAuthorizationHeaders(getAccessToken))
      .then((apiResults) => {
        const userFromApi = apiResults.data
        const { first_name, last_name, email } = userFromApi
        const userFullName = getUserName(userFromApi)

        if (!userFromApi) {
          throw Error('User Profile not returned from API')
        }

        const userToStore = {
          id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
          user: { ...userProfile, first_name, last_name, email, full_name: userFullName },
        }

        return dexieInstance.uiState_currentUser.put(userToStore).then(() => userToStore.user)
      })
  }

  return Promise.reject(new Error(language.error.appNotAuthenticatedOrReady))
}
