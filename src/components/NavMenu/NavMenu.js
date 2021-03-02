import React from 'react'
import { Column } from '../generic/positioning'
import { NavLinkSidebar } from '../generic/links'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import {
  IconCollect,
  IconSites,
  IconCopy,
  IconData,
  IconGraph,
  IconAdmin,
  IconUsers,
  IconHeart,
  IconSharing,
} from '../icons'

/**
 * Describe your component
 */
const NavMenu = () => {
  const currentProjectPath = useCurrentProjectPath()

  return (
    <Column as="nav">
      <NavLinkSidebar to={`${currentProjectPath}/collecting`}>
        <IconHeart />
        Project Health
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/collecting`}>
        <IconCollect />
        Collecting
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/sites`}>
        <IconSites />
        Sites
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/management-regimes`}>
        <IconCopy />
        Management Regimes
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/data`}>
        <IconData />
        Submitted
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/graphs-and-maps`}>
        <IconGraph />
        Graphs and Maps
      </NavLinkSidebar>
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

export default NavMenu
