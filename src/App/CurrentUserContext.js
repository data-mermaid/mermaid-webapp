import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

import { currentUserPropType } from './mermaidData/mermaidDataProptypes'

const CurrentUserContext = createContext()

const CurrentUserProvider = ({ children, value = {} }) => {
  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}

const useCurrentUser = () => {
  const context = useContext(CurrentUserContext)

  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider component')
  }

  return context
}

CurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: currentUserPropType,
}

export { useCurrentUser, CurrentUserProvider }
