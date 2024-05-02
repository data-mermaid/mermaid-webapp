import PropTypes from 'prop-types'
import React, { createContext, useContext, useState } from 'react'

const CurrentProjectContext = createContext()

const CurrentProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState()

  return (
    <CurrentProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </CurrentProjectContext.Provider>
  )
}

const useCurrentProject = () => {
  const context = useContext(CurrentProjectContext)

  if (context === undefined) {
    throw new Error('useCurrentProject must be used within a CurrentProjectProvider component')
  }

  return context
}

CurrentProjectProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { useCurrentProject, CurrentProjectProvider }
