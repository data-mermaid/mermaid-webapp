import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { reportOfflineSwitch } from './reportOfflineSwitch'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API
const OnlineStatusContext = createContext()

const OnlineStatusProvider = ({ children, value = {} }) => {
  const [isNavigatorOnline, setIsNavigatorOnline] = useState(navigator.onLine)
  const [isServerReachable, setIsServerReachable] = useState(true)
  const [hasUserTurnedAppOffline, setHasUserTurnedAppOffline] = useState(
    JSON.parse(localStorage.getItem('hasUserTurnedAppOffline')) || false,
  )
  const isAppOnline = isNavigatorOnline && isServerReachable === true && !hasUserTurnedAppOffline

  const canUserOverrideOnlineStatus = isServerReachable && isNavigatorOnline

  const rePingApiRef = useRef()

  const pingApi = () => {
    axios
      .get(`${apiBaseUrl}/health/`, {
        cache: false,
        method: 'HEAD',
      })
      .then(() => {
        setIsServerReachable(true)
      })
      .catch(() => {
        reportOfflineSwitch('health_check_failed')
        setIsServerReachable(false)
      })
  }

  const _setIsServerReachable = useEffect(() => {
    const stopPingingApi = () => {
      setIsServerReachable(null)
      clearInterval(rePingApiRef.current)
    }

    if (!isNavigatorOnline) {
      stopPingingApi()
    }
    if (isNavigatorOnline) {
      pingApi()
      rePingApiRef.current = window.setInterval(() => {
        pingApi()
      }, 30000)
    }

    return () => {
      stopPingingApi()
    }
  }, [isNavigatorOnline])

  const toggleUserOnlineStatusOverride = () => {
    const isTheUserAboutToTurnTheAppOnline = hasUserTurnedAppOffline // this is still old state, we havent updated anything yet, thats why its the opposite of what you would expect.

    if (isTheUserAboutToTurnTheAppOnline) {
      // do a health check on the server. If its dead, we dont want to wait forever for the next scheduled one
      // we do this before we update hasUserTurnedAppOffline to avoid race conditions with updating state
      pingApi()
    }

    localStorage.setItem('hasUserTurnedAppOffline', !hasUserTurnedAppOffline)
    setHasUserTurnedAppOffline(!hasUserTurnedAppOffline)
  }

  const setServerNotReachable = (error) => {
    // The path without its query string is enough to see which requests fail
    reportOfflineSwitch('request_no_response', {
      method: error?.config?.method,
      url: error?.config?.url?.split('?')[0],
      code: error?.code,
    })
    setIsServerReachable(false)
  }

  const _setIsNavigatorOnline = useEffect(() => {
    const handleOnline = () => {
      setIsNavigatorOnline(true)
    }
    const handleOffline = () => {
      reportOfflineSwitch('browser_offline')
      setIsNavigatorOnline(false)
    }
    const cleanup = () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return cleanup
  }, [])

  return (
    // the value prop spread here allows for online status to be mocked for testing
    <OnlineStatusContext.Provider
      value={{
        isAppOnline,
        canUserOverrideOnlineStatus,
        toggleUserOnlineStatusOverride,
        setServerNotReachable,
        ...value,
      }}
    >
      {children}
    </OnlineStatusContext.Provider>
  )
}

const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext)

  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider')
  }

  return context
}

OnlineStatusProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({ isAppOnline: PropTypes.bool }),
}

export { OnlineStatusProvider, useOnlineStatus }
