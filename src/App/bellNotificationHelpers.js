import axios from '../library/axiosRetry'
import language from '../language'
import { getAuthorizationHeaders } from '../library/getAuthorizationHeaders'
import { getPaginatedMermaidData } from './mermaidData/getPaginatedMermaidData'

export const getBellNotifications = async ({
  apiBaseUrl,
  getAccessToken,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  if (!apiBaseUrl) {
    throw new Error('getBellNotifications needs an API base url')
  }

  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndReady = isAuthenticatedAndReady && isAppOnline

  if (!isOnlineAuthenticatedAndReady) {
    return Promise.reject(new Error(language.error.appNotAuthenticatedOrReady))
  }
  return await getPaginatedMermaidData({
    url: `${apiBaseUrl}/notifications/`,
    authorizationHeaders: await getAuthorizationHeaders(getAccessToken),
    axios,
    errorCallback: (error) => {
      console.error(error.response || error)
      throw error
    },
  })
}

export const deleteBellNotification = async (
  notificationId,
  { apiBaseUrl, getAccessToken, isMermaidAuthenticated, isAppOnline },
) => {
  if (!apiBaseUrl) {
    throw new Error('deleteBellNotification needs an API base url')
  }

  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndReady = isAuthenticatedAndReady && isAppOnline

  if (isOnlineAuthenticatedAndReady) {
    return axios
      .delete(
        `${apiBaseUrl}/notifications/${notificationId}`,
        await getAuthorizationHeaders(getAccessToken),
      )
      .catch((error) => {
        console.error(error.response || error)
        throw error
      })
  }

  return Promise.reject(new Error(language.error.appNotAuthenticatedOrReady))
}

export const deleteAllBellNotifications = async ({
  apiBaseUrl,
  getAccessToken,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  if (!apiBaseUrl) {
    throw new Error('deleteAllBellNotifications needs an API base url')
  }

  const isAuthenticatedAndReady = isMermaidAuthenticated
  const isOnlineAuthenticatedAndReady = isAuthenticatedAndReady && isAppOnline

  if (isOnlineAuthenticatedAndReady) {
    return axios
      .delete(
        `${apiBaseUrl}/notifications/delete_all/`,
        await getAuthorizationHeaders(getAccessToken),
      )
      .catch((error) => {
        console.error(error.response || error)
        throw error
      })
  }

  return Promise.reject(new Error(language.error.appNotAuthenticatedOrReady))
}
