import PropTypes from 'prop-types'

import React, { createContext, useContext, useState } from 'react'

const SyncStatusContext = createContext()

// the value prop spread here allows for online status to be mocked for testing

const SyncStatusProvider = ({ children, value = {} }) => {
  const [isOfflineStorageHydrated, setIsOfflineStorageHydrated] = useState(false)
  const [isSyncInProgress, setIsSyncInProgress] = useState(true)
  const [syncErrors, setSyncErrors] = useState([])

  return (
    <SyncStatusContext.Provider
      value={{
        isOfflineStorageHydrated,
        isSyncInProgress,
        setIsOfflineStorageHydrated,
        setIsSyncInProgress,
        setSyncErrors,
        syncErrors,
        ...value,
      }}
    >
      {children}
    </SyncStatusContext.Provider>
  )
}

const useSyncStatus = () => {
  const context = useContext(SyncStatusContext)

  if (context === undefined) {
    throw new Error('useSyncStatus must be used within a SyncStatusProvider')
  }

  return context
}

SyncStatusProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({
    isOfflineStorageHydrated: PropTypes.bool,
    isSyncInProgress: PropTypes.bool,
    setIsOfflineStorageHydrated: PropTypes.func,
    setIsSyncInProgress: PropTypes.func,
    setSyncErrors: PropTypes.func,
    syncErrors: PropTypes.bool,
  }),
}

export { SyncStatusProvider, useSyncStatus }
