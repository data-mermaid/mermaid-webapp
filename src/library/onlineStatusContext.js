import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'

const OnlineStatusContext = createContext()

const OnlineStatusProvider = ({ children, value }) => {
  const [isNavigatorOnline, setIsNavigatorOnline] = useState(navigator.onLine)

  const isAppOnline = isNavigatorOnline

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
    <OnlineStatusContext.Provider value={{ isAppOnline, ...value }}>
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
  value: PropTypes.shape({ isAppOnline: PropTypes.bool }),
}

OnlineStatusProvider.defaultProps = { value: {} }

export { OnlineStatusProvider, useOnlineStatus }
