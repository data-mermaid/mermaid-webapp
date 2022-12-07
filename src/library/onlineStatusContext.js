import PropTypes from 'prop-types'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API
const OnlineStatusContext = createContext()

const OnlineStatusProvider = ({ children, value }) => {
  const [isNavigatorOnline, setIsNavigatorOnline] = useState(navigator.onLine)
  const [isServerReachable, setIsServerReachable] = useState(true)
  const [hasUserTurnedAppOffline, setHasUserTurnedAppOffline] = useState(
    JSON.parse(localStorage.getItem('hasUserTurnedAppOffline')) || false,
  )
  const isAppOnline = isNavigatorOnline && isServerReachable === true && !hasUserTurnedAppOffline

  const canUserOverrideOnlineStatus = isServerReachable && isNavigatorOnline

  const rePingApiRef = useRef()

  const stopPingingApi = useCallback(() => {
    setIsServerReachable(null)
    clearInterval(rePingApiRef.current)
  }, [])

  const _setIsServerReachable = useEffect(() => {
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
          setIsServerReachable(false)
        })
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
  }, [isNavigatorOnline, stopPingingApi])

  const toggleUserOnlineStatusOverride = () => {
    localStorage.setItem('hasUserTurnedAppOffline', !hasUserTurnedAppOffline)
    setHasUserTurnedAppOffline(!hasUserTurnedAppOffline)
  }

  const _setIsNavigatorOnline = useEffect(() => {
    const handleOnline = () => {
      setIsNavigatorOnline(true)
    }
    const handleOffline = () => {
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

OnlineStatusProvider.defaultProps = { value: {} }

export { OnlineStatusProvider, useOnlineStatus }
