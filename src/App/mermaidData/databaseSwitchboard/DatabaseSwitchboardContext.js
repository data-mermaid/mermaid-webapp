import PropTypes from 'prop-types'

import React, { createContext, useContext } from 'react'
import { databaseSwitchboardPropTypes } from './DatabaseSwitchboard'

const DatabaseSwitchboardInstanceContext = createContext()

const DatabaseSwitchboardInstanceProvider = ({ children, value = {} }) => {
  return (
    <DatabaseSwitchboardInstanceContext.Provider value={{ databaseSwitchboardInstance: value }}>
      {children}
    </DatabaseSwitchboardInstanceContext.Provider>
  )
}

DatabaseSwitchboardInstanceProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: databaseSwitchboardPropTypes,
}

const useDatabaseSwitchboardInstance = () => {
  const context = useContext(DatabaseSwitchboardInstanceContext)

  if (context === undefined) {
    throw new Error(
      'useDatabaseSwitchboardInstance must be used within an DatabaseSwitchboardInstanceProvider',
    )
  }

  return context
}

export { DatabaseSwitchboardInstanceProvider, useDatabaseSwitchboardInstance }
