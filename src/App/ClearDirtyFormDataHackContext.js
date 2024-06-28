import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

// This context supports useUnsavedDirtyFormDataUtilities.js
// we lost the use of history.listen when we upgraded to react router v6.
// router.subscribe replaces it without issues.
// Alternative considered: listenting to location from useLocation.
// It triggers only after a form page loads with data meant to be cleared.
// CreateBrowserHistory was also considered, however it didnt trigger in all cases
const ClearPersistedFormDataHackContext = createContext()

const ClearPersistedFormDataHackProvider = ({ children, value = {} }) => {
  return (
    <ClearPersistedFormDataHackContext.Provider value={value}>
      {children}
    </ClearPersistedFormDataHackContext.Provider>
  )
}

const useRouterFromClearPersistedFormDataHack = () => {
  const context = useContext(ClearPersistedFormDataHackContext)

  if (context === undefined) {
    throw new Error(
      'useRouterFromClearPersistedFormDataHack must be used within a ClearPersistedFormDataHackProvider',
    )
  }

  return context
}

ClearPersistedFormDataHackProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
}

export { ClearPersistedFormDataHackProvider, useRouterFromClearPersistedFormDataHack }
