import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { getToastArguments } from '../library/getToastArguments'
import {
  getBellNotifications,
  deleteBellNotification,
  deleteAllBellNotifications,
} from './bellNotificationHelpers'

export const useInitializeBellNotifications = ({
  apiBaseUrl,
  getAccessToken,
  isMermaidAuthenticated,
  isAppOnline,
  handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied,
}) => {
  const { t } = useTranslation()
  const notificationsUnavailableText = t('notifications_unavailable')
  const notificationNotDeletedText = t('notification_not_removed')

  const location = useLocation() // Changes when the route changes. Useful for fetching notifications again

  const [notifications, setNotifications] = useState([])

  const updateNotifications = () => {
    let isMounted = true

    if (isMermaidAuthenticated && apiBaseUrl && isAppOnline) {
      getBellNotifications({
        apiBaseUrl,
        getAccessToken,
        isMermaidAuthenticated,
        isAppOnline,
      })
        .then((notifications) => {
          if (isMounted && notifications) {
            setNotifications(notifications)
          }
        })
        .catch((error) => {
          handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied({
            error,
            callback: () => {
              toast.error(...getToastArguments(notificationsUnavailableText))
            },
            shouldShowServerNonResponseMessage: false,
          })
        })
    }

    return () => {
      isMounted = false
    }
  }

  const _initializeNotifications = useEffect(() => {
    updateNotifications()
  }, [
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated,
    isAppOnline,
    location,
    notificationsUnavailableText,
  ]) // eslint-disable-line react-hooks/exhaustive-deps

  const deleteNotification = (notificationId) => {
    if (isMermaidAuthenticated && apiBaseUrl) {
      deleteBellNotification(notificationId, {
        apiBaseUrl,
        getAccessToken,
        isMermaidAuthenticated,
        isAppOnline,
      })
        .then(() => {
          updateNotifications()
        })
        .catch((error) => {
          handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied({
            error,
            callback: () => {
              toast.error(...getToastArguments(notificationNotDeletedText))
            },
          })
        })
    }
  }

  const deleteAllNotifications = () => {
    if (isMermaidAuthenticated && apiBaseUrl) {
      deleteAllBellNotifications({
        apiBaseUrl,
        getAccessToken,
        isMermaidAuthenticated,
        isAppOnline,
      })
        .then(() => {
          updateNotifications()
        })
        .catch((error) => {
          handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied({
            error,
            callback: () => {
              toast.error(...getToastArguments(notificationNotDeletedText))
            },
          })
        })
    }
  }

  return { notifications, deleteNotification, deleteAllNotifications }
}
