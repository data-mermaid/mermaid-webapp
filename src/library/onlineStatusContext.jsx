import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { reportOfflineSwitch } from './reportOfflineSwitch'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API
// A single failed health check is often a device waking up before its network is back,
// so we check once more after this delay before switching Collect offline.
const HEALTH_CHECK_RETRY_DELAY_MS = 4000
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
  const healthCheckRetryRef = useRef()
  // pingApi runs from intervals and listeners that close over stale state, so it reads this ref
  const isServerReachableRef = useRef(isServerReachable)
  // Bumped by a successful check and when pinging stops. A request that started under an older
  // value is stale, so its result is ignored rather than overriding newer state or reporting.
  const healthCheckGenerationRef = useRef(0)

  useEffect(() => {
    isServerReachableRef.current = isServerReachable
  }, [isServerReachable])

  const pingApi = () => {
    const checkHealth = ({ isRetry }) => {
      const generation = healthCheckGenerationRef.current

      axios
        .get(`${apiBaseUrl}/health/`, {
          cache: false,
          method: 'HEAD',
        })
        .then(() => {
          if (generation !== healthCheckGenerationRef.current) {
            return
          }
          healthCheckGenerationRef.current += 1
          clearTimeout(healthCheckRetryRef.current)
          healthCheckRetryRef.current = undefined
          isServerReachableRef.current = true
          setIsServerReachable(true)
        })
        .catch(() => {
          if (generation !== healthCheckGenerationRef.current) {
            return
          }
          // While the server is considered reachable, one failure only schedules a retry
          if (!isRetry && isServerReachableRef.current === true) {
            if (!healthCheckRetryRef.current) {
              healthCheckRetryRef.current = window.setTimeout(() => {
                healthCheckRetryRef.current = undefined
                checkHealth({ isRetry: true })
              }, HEALTH_CHECK_RETRY_DELAY_MS)
            }

            return
          }
          clearTimeout(healthCheckRetryRef.current)
          healthCheckRetryRef.current = undefined
          reportOfflineSwitch('health_check_failed')
          isServerReachableRef.current = false
          setIsServerReachable(false)
        })
    }

    checkHealth({ isRetry: false })
  }

  const _setIsServerReachable = useEffect(() => {
    const stopPingingApi = () => {
      healthCheckGenerationRef.current += 1
      setIsServerReachable(null)
      clearInterval(rePingApiRef.current)
      clearTimeout(healthCheckRetryRef.current)
      healthCheckRetryRef.current = undefined
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

    // A hidden tab is throttled and a sleeping device doesn't ping at all, so check
    // as soon as the tab is visible again instead of waiting for the next interval
    const pingApiWhenVisible = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        pingApi()
      }
    }

    document.addEventListener('visibilitychange', pingApiWhenVisible)

    return () => {
      document.removeEventListener('visibilitychange', pingApiWhenVisible)
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
