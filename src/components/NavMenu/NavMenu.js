import React from 'react'
import styled from 'styled-components'
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
const NavWrapper = styled('nav')`
  display: flex;
  flex-direction: column;
  /* border-right: solid 2px ${(props) => props.theme.color.black}; */
`
const NavList = styled('ul')`
  padding: 0;
  & ul {
    padding: 0;
  }
`
const NavHeader = styled('p')`
  text-transform: uppercase;
  font-weight: 900;
  margin: ${(props) => props.theme.spacing.small} 0 0 0;
  border-bottom: 1px solid;
  letter-spacing: 2px;
  padding: ${(props) => props.theme.spacing.small};
`

const NavMenu = () => {
  const currentProjectPath = useCurrentProjectPath()

  return (
    <NavWrapper>
      <NavList>
        <li>
          <NavHeader>Project Overview</NavHeader>
          <ul>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/health`}>
                <IconHeart /> Project Health
              </NavLinkSidebar>
            </li>
          </ul>
        </li>
        <li>
          <NavHeader>Collect</NavHeader>
          <ul>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/collecting`}>
                <IconCollect />
                Collecting
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/sites`}>
                <IconSites />
                Sites
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/management-regimes`}>
                <IconCopy />
                Management Regimes
              </NavLinkSidebar>
            </li>
          </ul>
        </li>
        <li>
          <NavHeader>Data</NavHeader>
          <ul>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/data`}>
                <IconData />
                Submitted
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/graphs-and-maps`}>
                <IconGraph />
                Graphs and Maps
              </NavLinkSidebar>
            </li>
          </ul>
        </li>
        <li>
          <NavHeader>Admin</NavHeader>
          <ul>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/admin`}>
                <IconAdmin />
                Project Info
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/users`}>
                <IconUsers />
                Users
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/fish-families`}>
                <IconHeart />
                Fish Families
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/data-sharing`}>
                <IconSharing />
                Data Sharing
              </NavLinkSidebar>
            </li>
          </ul>
        </li>
      </NavList>
    </NavWrapper>
  )
}

export default NavMenu
