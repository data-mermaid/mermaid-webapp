import axios from '../library/axiosRetry'
import i18next from 'i18next'
import { getAuthorizationHeaders } from '../library/getAuthorizationHeaders'
import { userRole } from './mermaidData/userRole'

const getUserName = (user) => {
  const { first_name, last_name, email } = user

  if (first_name.length && last_name.length) {
    return `${first_name} ${last_name}`
  }

  if (first_name.length) {
    return first_name
  }

  if (last_name.length) {
    return last_name
  }

  const emailName = email.match(/^.+(?=@)/)[0]

  return emailName
}

export const getCurrentUserProfile = async ({
  apiBaseUrl,
  getAccessToken,
  dexieCurrentUserInstance,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  if (!apiBaseUrl) {
    throw new Error('getCurrentUserProfile needs an API base url')
  }
  if (!dexieCurrentUserInstance) {
    throw new Error('getCurrentUserProfile needs a dexieCurrentUserInstance')
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

        return dexieCurrentUserInstance.currentUser.put(userToStore).then(() => userFromApi)
      })
  }
  if (isOfflineAuthenticatedAndReady) {
    return dexieCurrentUserInstance.currentUser.toArray().then((results) => {
      const { user } = results[0]

      if (!user) {
        throw Error('User Profile not returned from offline storage')
      }

      return user
    })
  }

  return Promise.reject(new Error(i18next.t('error.app_not_authenticated')))
}

export const setCurrentUserProfile = async ({
  apiBaseUrl,
  getAccessToken,
  dexieCurrentUserInstance,
  isMermaidAuthenticated,
  isAppOnline,
  userProfile,
  isSyncInProgress,
}) => {
  if (!apiBaseUrl) {
    throw new Error('setCurrentUserProfile needs an API base url')
  }
  if (!dexieCurrentUserInstance) {
    throw new Error('setCurrentUserProfile needs a dexieInstance')
  }

  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndReady = isAuthenticatedAndReady && isAppOnline

  if (isOnlineAuthenticatedAndReady && !isSyncInProgress) {
    return axios
      .put(`${apiBaseUrl}/me/`, userProfile, await getAuthorizationHeaders(getAccessToken))
      .then((apiResults) => {
        const userFromApi = apiResults.data

        if (!userFromApi) {
          throw Error('User Profile not returned from API')
        }

        const { first_name, last_name, email } = userFromApi
        const userFullName = getUserName(userFromApi)

        const userToStore = {
          id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
          user: { ...userProfile, first_name, last_name, email, full_name: userFullName },
        }

        return dexieCurrentUserInstance.currentUser.put(userToStore).then(() => userToStore.user)
      })
  }

  return Promise.reject(new Error(i18next.t('error.app_not_authenticated')))
}

export const getProjectRole = (userProfile, projectId) => {
  return userProfile?.projects?.find(({ id: idToCheck }) => idToCheck === projectId)?.role
}

export const getIsUserReadOnlyForProject = (userProfile, projectId) => {
  return getProjectRole(userProfile, projectId) === userRole.read_only
}

export const getIsProjectProfileReadOnly = (profile) => profile.role === userRole.read_only

export const getIsUserAdminForProject = (userProfile, projectId) => {
  return getProjectRole(userProfile, projectId) === userRole.admin
}
