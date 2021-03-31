import React from 'react'
import styled, { css } from 'styled-components'
import theme from '../../theme'
import { NavLinkSidebar } from '../generic/links'
import {
  mediaQueryTabletLandscapeOnly,
  mediaQueryPhoneOnly,
} from '../../library/styling/mediaQueries'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import {
  IconCollect,
  IconSites,
  IconData,
  IconFish,
  IconMgmt,
  IconGraph,
  IconAdmin,
  IconUsers,
  IconHeart,
  IconSharing,
} from '../icons'

const NavWrapper = styled('nav')`
  display: flex;
  flex-direction: column;
  height: 100%;
  white-space: nowrap;
  width: ${theme.spacing.sideNavWidthDesktop};
  ${mediaQueryTabletLandscapeOnly(css`
    width: ${theme.spacing.sideNavWidthTabletLandscapeOnly};
    white-space: normal;
  `)}
  ${mediaQueryPhoneOnly(css`
    width: ${theme.spacing.sideNavWidthPhoneOnly};
    white-space: auto;
  `)}
`
const NavList = styled('ul')`
  position: sticky;
  top: ${theme.spacing.headerHeight};
  margin-top: -1px;
  &,
  & ul {
    padding: 0;
    li {
      a {
        color: ${theme.color.black};
      }
      ${mediaQueryPhoneOnly(css`
        a {
          font-size: smaller;
          padding: ${theme.spacing.small} ${theme.spacing.xsmall};
        }
      `)}
    }
  }
`
const NavHeader = styled('p')`
  margin: 0;
  color: ${theme.color.black};
  padding: ${theme.spacing.small};
  padding-top: ${theme.spacing.large};
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
  ${theme.typography.upperCase};
`

const NavMenu = () => {
  const projectUrl = useCurrentProjectPath()

  return (
    <NavWrapper>
      <NavList>
        <li>
          <NavHeader>Project Overview</NavHeader>
          <ul>
            <li>
              <NavLinkSidebar to={`${projectUrl}/health`}>
                <IconHeart /> <span>Project Health</span>
              </NavLinkSidebar>
            </li>
          </ul>
        </li>
        <li>
          <NavHeader>Collect</NavHeader>
          <ul>
            <li>
              <NavLinkSidebar to={`${projectUrl}/collecting`}>
                <IconCollect />
                <span>Collecting</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${projectUrl}/sites`}>
                <IconSites />
                <span>Sites</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${projectUrl}/management-regimes`}>
                <IconMgmt />
                <span>Management Regimes</span>
              </NavLinkSidebar>
            </li>
          </ul>
        </li>
        <li>
          <NavHeader>Data</NavHeader>
          <ul>
            <li>
              <NavLinkSidebar to={`${projectUrl}/data`}>
                <IconData />
                <span>Submitted</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${projectUrl}/graphs-and-maps`}>
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
              <NavLinkSidebar to={`${projectUrl}/admin`}>
                <IconAdmin />
                <span>Project Info</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${projectUrl}/users`}>
                <IconUsers />
                <span>Users</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${projectUrl}/fish-families`}>
                <IconFish />
                <span>Fish Families</span>
              </NavLinkSidebar>
            </li>
            <li>
              <NavLinkSidebar to={`${projectUrl}/data-sharing`}>
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
