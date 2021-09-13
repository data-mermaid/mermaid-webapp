import axios from 'axios'
import PropTypes from 'prop-types'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

const OnlineStatusContext = createContext()
const apiBaseUrl = process.env.REACT_APP_MERMAID_API

const OnlineStatusProvider = ({ children, value }) => {
  const pingInterval = 5000
  const offlineToggleValueLocalStorage = JSON.parse(
    localStorage.getItem('offline-toggle'),
  )
  const [isWifiOn, setIsWifiOn] = useState(navigator.onLine)
  const [pingId, setPingId] = useState(null)
  const [pingState, setPingState] = useState(true)
  const isAppOnline =
    pingState === true && isWifiOn && offlineToggleValueLocalStorage !== true

  const stopPing = useCallback(() => {
    if (pingId !== null) {
      const pingIdWhenClear = window.clearTimeout(pingId)

      setPingId(pingIdWhenClear)
    }
    setPingState(null)
  }, [pingId, setPingId, setPingState])

  const ping = useCallback(() => {
    axios
      .get(`${apiBaseUrl}/health/`, {
        cache: false,
        method: 'HEAD',
      })
      .then(
        () => {
          setPingState(true)
        },
        () => {
          setPingState(false)
        },
      )
      .finally(() => {
        const pingIdUpdatePeriodically = window.setTimeout(() => {
          ping()
        }, pingInterval)

        setPingId(pingIdUpdatePeriodically)
      })
  }, [])

  const _startPingCheck = useEffect(() => {
    if (isAppOnline) {
      ping()
    } else {
      stopPing()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      setIsWifiOn(true)
      ping()
    }
    const handleOffline = () => {
      setIsWifiOn(false)
      stopPing()
    }

    const cleanup = () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return cleanup
  }, [ping, stopPing])

  return (
    // the value prop spread here allows for online status to be mocked for testing
    <OnlineStatusContext.Provider
      value={{ isWifiOn, isAppOnline, pingState, ping, stopPing, ...value }}
    >
      {children}
    </OnlineStatusContext.Provider>
  )
}

const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext)

  if (context === undefined) {
    throw new Error(
      'useOnlineStatus must be used within an OnlineStatusProvider',
    )
  }

  return context
}

OnlineStatusProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({ isWifiOn: PropTypes.bool }),
}

OnlineStatusProvider.defaultProps = { value: {} }

export { OnlineStatusProvider, useOnlineStatus }
