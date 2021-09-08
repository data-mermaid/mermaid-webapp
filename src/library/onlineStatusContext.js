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
  const pingInterval = 7000
  const offlineToggleValueLocalStorage = JSON.parse(
    localStorage.getItem('offline-toggle'),
  )
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pingId, setPingId] = useState(null)
  const [pingState, setPingState] = useState(true)
  const isAppOnline =
    pingState === true && isOnline && offlineToggleValueLocalStorage !== true

  console.log('PING state ', pingState)

  const stopPing = useCallback(() => {
    console.log('Stop Ping runs')
    if (pingId !== null) {
      const pingIdWhenClear = clearTimeout(pingId)

      setPingId(pingIdWhenClear)
    }
    setPingState(false)
  }, [pingId, setPingId, setPingState])

  const ping = useCallback(() => {
    console.log('Ping runs')
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
        const pingIdUpdatePeriodically = setTimeout(() => {
          ping()
        }, pingInterval)

        setPingId(pingIdUpdatePeriodically)
      })
  }, [])

  useEffect(() => {
    if (isAppOnline) {
      ping()
    } else {
      stopPing()
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      ping()
    }
    const handleOffline = () => {
      setIsOnline(false)
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
      value={{ isOnline, isAppOnline, ping, stopPing, ...value }}
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
  value: PropTypes.shape({ isOnline: PropTypes.bool }),
}

OnlineStatusProvider.defaultProps = { value: {} }

export { OnlineStatusProvider, useOnlineStatus }
