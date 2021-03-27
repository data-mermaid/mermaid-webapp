import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'

const OnlineStatusContext = createContext()

const OnlineStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }
    const handleOffline = () => {
      setIsOnline(false)
    }
    const cleanup = () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }

    setIsOnline(navigator.onLine) // move this
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return cleanup
  }, [])

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>
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
}

export { OnlineStatusProvider, useOnlineStatus }
