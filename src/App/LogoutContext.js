import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const LogoutContext = createContext()

const LogoutProvider = ({ children, value }) => {
  return (
    <LogoutContext.Provider value={value}>{children}</LogoutContext.Provider>
  )
}

const useLogout = () => {
  const context = useContext(LogoutContext)

  if (context === undefined) {
    throw new Error(
      'useLogout must be used within a LogoutProvider component',
    )
  }

  return context
}

LogoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.func,
}

LogoutProvider.defaultProps = {
  value: {},
}

export { useLogout, LogoutProvider }
