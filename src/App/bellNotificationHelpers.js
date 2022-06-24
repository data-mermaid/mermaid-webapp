import axios from 'axios'
import language from '../language'
import { getAuthorizationHeaders } from '../library/getAuthorizationHeaders'

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

  if (isOnlineAuthenticatedAndReady) {
    return axios
      .get(`${apiBaseUrl}/notifications/?limit=5000`, await getAuthorizationHeaders(getAccessToken))
      .then((apiResults) => {
        const notificationsResponse = apiResults.data

        if (!notificationsResponse) {
          throw Error('Notifications not returned from API')
        }

        return notificationsResponse
      })
      .catch((error) => {
        console.error(error.response)
      })
  }

  return Promise.reject(new Error(language.error.appNotAuthenticatedOrReady))
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
        console.error(error.response)
      })
  }

  return Promise.reject(new Error(language.error.appNotAuthenticatedOrReady))
}
