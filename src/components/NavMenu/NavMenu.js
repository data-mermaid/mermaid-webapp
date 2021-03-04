import React from 'react'
import styled from 'styled-components'
import { Column } from '../generic/positioning'
import { NavLinkSidebar } from '../generic/links'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import { H4 } from '../generic/text'
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
const NavHeader = styled(H4)`
  text-transform: uppercase;
  border-bottom: 1px solid;
  padding: 10px;
`

const NavMenu = () => {
  const currentProjectPath = useCurrentProjectPath()

  return (
    <Column as="nav">
      <NavHeader>Project Overview</NavHeader>
      <NavLinkSidebar to={`${currentProjectPath}/health`}>
        <IconHeart /> Project Health
      </NavLinkSidebar>

      <NavHeader>Collect</NavHeader>
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

      <NavHeader>Data</NavHeader>
      <NavLinkSidebar to={`${currentProjectPath}/data`}>
        <IconData />
        Submitted
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/graphs-and-maps`}>
        <IconGraph />
        Graphs and Maps
      </NavLinkSidebar>

      <NavHeader>Admin</NavHeader>
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
