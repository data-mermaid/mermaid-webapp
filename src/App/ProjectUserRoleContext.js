import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

import { observersPropType } from './mermaidData/mermaidDataProptypes'

const ProjectUserRoleContext = createContext({})

const ProjectUserRoleProvider = ({ children, value }) => {
  return <ProjectUserRoleContext.Provider value={value}>{children}</ProjectUserRoleContext.Provider>
}

const useProjectUserRole = () => {
  const context = useContext(ProjectUserRoleContext)

  if (context === undefined) {
    throw new Error('useProjectUserRole must be used within a ProjectUserRoleProvider component')
  }

  return context
}

ProjectUserRoleProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: observersPropType,
}

ProjectUserRoleProvider.defaultProps = {
  value: {},
}

export { useProjectUserRole, ProjectUserRoleProvider }
