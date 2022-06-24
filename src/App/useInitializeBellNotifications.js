import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import language from '../language'
import { getToastArguments } from '../library/getToastArguments'
import { getBellNotifications, deleteBellNotification } from './bellNotificationHelpers'

export const useInitializeBellNotifications = ({
  apiBaseUrl,
  getAccessToken,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  const location = useLocation() // Changes when the route changes. Useful for fetching notifications again

  const [notifications, setNotifications] = useState()

  const updateNotifications = () => {
    let isMounted = true

    if (isMermaidAuthenticated && apiBaseUrl && isAppOnline) {
      getBellNotifications({
        apiBaseUrl,
        getAccessToken,
        isMermaidAuthenticated,
        isAppOnline,
      })
        .then((results) => {
          if (isMounted && results) {
            setNotifications(results)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.notificationsUnavailable))
        })
    }

    return () => {
      isMounted = false
    }
  }

  const _initializeNotifications = useEffect(() => {
    updateNotifications()
  }, [apiBaseUrl, getAccessToken, isMermaidAuthenticated, isAppOnline, location]) // eslint-disable-line react-hooks/exhaustive-deps
  const deleteNotification = (notificationId) => {
    if (
      isMermaidAuthenticated && apiBaseUrl
    ) {
      deleteBellNotification(notificationId, {
        apiBaseUrl,
        getAccessToken,
        isMermaidAuthenticated,
        isAppOnline
      })
        .then(() => {
          updateNotifications()
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.notificationNotDeleted))
        })
    }
  }

  return { notifications, deleteNotification }
}
