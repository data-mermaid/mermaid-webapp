import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
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

  const location = useLocation() // Changes when the route changes. Useful for fetching notifications again

  const [notifications, setNotifications] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationLoopCount, setAnimationLoopCount] = useState(1)
  const prevNotificationCountRef = useRef(null)
  const prevAuthRef = useRef(isMermaidAuthenticated)
  const hasTriggeredInitialAnimationRef = useRef(false)

  const markNotificationsOpened = () => {
    sessionStorage.setItem('notifications_opened', 'true')
    setIsAnimating(false)
  }

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
              toast.error(...getToastArguments(t('notifications_unavailable')))
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
  }, [apiBaseUrl, getAccessToken, isMermaidAuthenticated, isAppOnline, location]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isMermaidAuthenticated || !isAppOnline) {
      return undefined
    }

    const intervalId = setInterval(() => {
      updateNotifications()
    }, 60000)

    return () => {
      clearInterval(intervalId)
    }
  }, [isMermaidAuthenticated, isAppOnline]) // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger animation once on initial load if notifications exist and user hasn't opened bell this session
  useEffect(() => {
    if (hasTriggeredInitialAnimationRef.current) {
      return undefined
    }
    if (notifications.length === 0) {
      return undefined
    }

    hasTriggeredInitialAnimationRef.current = true
    const hasOpenedThisSession = sessionStorage.getItem('notifications_opened') === 'true'
    if (hasOpenedThisSession) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setAnimationLoopCount(1)
      setIsAnimating(true)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [notifications])

  // Trigger animation when polling detects new notifications
  useEffect(() => {
    const prevCount = prevNotificationCountRef.current

    if (prevCount !== null && notifications.length > prevCount) {
      setAnimationLoopCount(3)
      setIsAnimating(true)
    }

    prevNotificationCountRef.current = notifications.length
  }, [notifications])

  // Trigger animation on re-login if notifications exist and user hasn't opened bell this session
  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current
    prevAuthRef.current = isMermaidAuthenticated

    if (!wasAuthenticated && isMermaidAuthenticated) {
      prevNotificationCountRef.current = null // reset so polling doesn't false-trigger after re-login
      const hasOpenedThisSession = sessionStorage.getItem('notifications_opened') === 'true'
      if (!hasOpenedThisSession && notifications.length > 0) {
        setAnimationLoopCount(3)
        setIsAnimating(true)
      }
    }
  }, [isMermaidAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

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
              toast.error(...getToastArguments(t('notification_not_removed')))
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
              toast.error(...getToastArguments(t('notification_not_removed')))
            },
          })
        })
    }
  }

  const stopAnimation = () => setIsAnimating(false)

  return {
    notifications,
    deleteNotification,
    deleteAllNotifications,
    isAnimating,
    animationLoopCount,
    markNotificationsOpened,
    stopAnimation,
  }
}
