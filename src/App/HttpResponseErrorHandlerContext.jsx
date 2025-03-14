import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const HttpResponseErrorHandlerContext = createContext()

const HttpResponseErrorHandlerProvider = ({ children, value = {} }) => {
  return (
    <HttpResponseErrorHandlerContext.Provider value={value}>
      {children}
    </HttpResponseErrorHandlerContext.Provider>
  )
}

const useHttpResponseErrorHandler = () => {
  const context = useContext(HttpResponseErrorHandlerContext)

  if (context === undefined) {
    throw new Error(
      'useHttpResponseErrorHandler must be used within a HttpResponseErrorHandlerProvider component',
    )
  }

  return context
}

HttpResponseErrorHandlerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.func,
}

export { HttpResponseErrorHandlerProvider, useHttpResponseErrorHandler }
