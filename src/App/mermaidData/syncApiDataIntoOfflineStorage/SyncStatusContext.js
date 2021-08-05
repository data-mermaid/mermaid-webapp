import PropTypes from 'prop-types'

import React, { createContext, useContext, useState } from 'react'

const SyncStatusContext = createContext()

// the value prop spread here allows for online status to be mocked for testing

const SyncStatusProvider = ({ children, value }) => {
  const [isSyncInProgress, setIsSyncInProgress] = useState(true)

  return (
    <SyncStatusContext.Provider
      value={{ isSyncInProgress, setIsSyncInProgress, ...value }}
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
    isSyncInProgress: PropTypes.bool,
    setIsSyncInProgress: PropTypes.func,
  }),
}

SyncStatusProvider.defaultProps = { value: {} }

export { SyncStatusProvider, useSyncStatus }
