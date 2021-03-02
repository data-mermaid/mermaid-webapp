import React from 'react'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import { NavLinkSidebar } from '../generic/links'
import { Column } from '../generic/positioning'
import { IconAdmin, IconHeart, IconSharing, IconUsers } from '../icons'

/**
 * Describe your component
 */
const AdminNav = () => {
  const currentProjectPath = useCurrentProjectPath()

  return (
    <Column as="nav">
      <NavLinkSidebar to={`${currentProjectPath}/admin`}>
        <IconAdmin />
        Project Info
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/users`}>
        <IconUsers />
        Users
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/fish-families`}>
        <IconHeart />
        Fish Families
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/data-sharing`}>
        <IconSharing />
        Data Sharing
      </NavLinkSidebar>
    </Column>
  )
}

export default AdminNav
