import React from 'react'
import styled, { css } from 'styled-components'
import { NavLinkSidebar } from '../generic/links'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
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
  border-right: solid 1px ${(props) => props.theme.color.border};
  height: 100%;
`
const NavList = styled('ul')`
  &,
  & ul {
    padding: 0;
  }
`
const NavHeader = styled('p')`
  text-transform: uppercase;
  font-weight: 900;
  margin: 0;
  border-top: solid 1px ${(props) => props.theme.color.border};
  letter-spacing: 2px;
  padding: ${(props) => props.theme.spacing.small};
  padding-top: ${(props) => props.theme.spacing.medium};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
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
                <IconHeart /> <span>Project Health</span>
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
                <span>Collecting</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/sites`}>
                <IconSites />
                <span>Sites</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/management-regimes`}>
                <IconCopy />
                <span>Management Regimes</span>
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
                <span>Submitted</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/graphs-and-maps`}>
                <IconGraph />
                <span>Graphs and Maps</span>
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
                <span>Project Info</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/users`}>
                <IconUsers />
                <span>Users</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/fish-families`}>
                <IconHeart />
                <span>Fish Families</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${currentProjectPath}/data-sharing`}>
                <IconSharing />
                <span>Data Sharing</span>
              </NavLinkSidebar>
            </li>
          </ul>
        </li>
      </NavList>
    </NavWrapper>
  )
}

export default NavMenu
