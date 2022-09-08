import React from 'react'
import styled, { css } from 'styled-components'
import { useParams, useLocation } from 'react-router-dom'
import { subNavNodePropTypes } from '../SubNavMenuRecordName/subNavNodePropTypes'
import theme from '../../theme'
import { NavLinkSidebar } from '../generic/links'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { useCurrentUser } from '../../App/CurrentUserContext'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import {
  IconCollect,
  IconSites,
  IconData,
  IconMgmt,
  IconInfo,
  IconUsers,
  IconSharing,
  IconUsersAndTransects,
  IconManagementRegimesOverview,
} from '../icons'
import { userRole } from '../../App/mermaidData/userRole'
import { getProjectRole } from '../../App/currentUserProfileHelpers'
import OfflineHide from '../generic/OfflineHide'
import CollectRecordsCount from '../CollectRecordsCount'
import SubNavMenuRecordName from '../SubNavMenuRecordName'

const NavWrapper = styled('nav')`
  background: ${theme.color.white};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${theme.spacing.sideNavWidth};
  ${mediaQueryPhoneOnly(css`
    width: ${theme.spacing.mobileSideNavWidth};
    font-size: ${theme.typography.xSmallFontSize};
  `)}
`
const NavList = styled('ul')`
  position: sticky;
  top: ${theme.spacing.headerHeight};
  margin-top: -1px;
  padding: 0;
  & ul {
    padding: 0;
    li {
      a {
        font-size: inherit;
        color: ${theme.color.black};
        ${mediaQueryPhoneOnly(css`
          padding: ${theme.spacing.small} ${theme.spacing.xsmall};
        `)}
      }
    }
  }
`
const NavHeader = styled('p')`
  margin: ${theme.spacing.large} 0 0 0;
  color: ${theme.color.textColor};
  padding: ${theme.spacing.large} 0 0 ${theme.spacing.medium};
  text-transform: uppercase;
  font-weight: 900;
  ${mediaQueryPhoneOnly(css`
    padding-left: 0;
    font-size: ${theme.typography.xSmallFontSize};
    text-align: center;
  `)}
`

const NavMenu = ({ subNavNode }) => {
  const projectUrl = useCurrentProjectPath()
  const { recordId, submittedRecordId, siteId, managementRegimeId, projectId } = useParams()
  const { pathname } = useLocation()
  const { currentUser } = useCurrentUser()

  const isCollectingSubNode = recordId || pathname.includes('collecting')
  const isSiteSubNode = siteId || pathname.includes('sites')
  const isManagementRegimeSubNode = managementRegimeId || pathname.includes('management-regimes')
  const isReadOnlyUser = getProjectRole(currentUser, projectId) === userRole.read_only

  return (
    <NavWrapper data-testid="content-page-side-nav">
      <NavList>
        <OfflineHide>
          <li>
            <NavHeader>Project Health</NavHeader>
            <ul>
              <li>
                <NavLinkSidebar to={`${projectUrl}/usersandtransects`}>
                  <IconUsersAndTransects /> <span>Users and Transects</span>
                </NavLinkSidebar>
              </li>
              <li>
                <NavLinkSidebar to={`${projectUrl}/managementregimesoverview`}>
                  <IconManagementRegimesOverview /> <span>Management Regimes Overview</span>
                </NavLinkSidebar>
              </li>
            </ul>
          </li>
        </OfflineHide>
        <li>
          <NavHeader>Collect</NavHeader>
          <ul>
            {!isReadOnlyUser && (
              <li>
                <NavLinkSidebar exact to={`${projectUrl}/collecting`}>
                  <IconCollect />
                  <span>Collecting</span>
                  <CollectRecordsCount />
                </NavLinkSidebar>
              </li>
            )}
            {isCollectingSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
            <li>
              <NavLinkSidebar exact to={`${projectUrl}/sites`}>
                <IconSites />
                <span>Sites</span>
              </NavLinkSidebar>
            </li>
            {isSiteSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
            <li>
              <NavLinkSidebar exact to={`${projectUrl}/management-regimes`}>
                <IconMgmt />
                <span>Management Regimes</span>
              </NavLinkSidebar>
            </li>
            {isManagementRegimeSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
          </ul>
        </li>
        <OfflineHide>
          <li>
            <NavHeader>Data</NavHeader>
            <ul>
              <li>
                <NavLinkSidebar exact to={`${projectUrl}/data`}>
                  <IconData />
                  <span>Submitted</span>
                </NavLinkSidebar>
              </li>
              {submittedRecordId && <SubNavMenuRecordName subNavNode={subNavNode} />}
              {/* hiding for alpha release because leads nowhere useful */}
              {/* <li>
                <NavLinkSidebar to={`${projectUrl}/graphs-and-maps`}>
                  <IconGraph />
                  <span>Graphs and Maps</span>
                </NavLinkSidebar>
              </li> */}
            </ul>
          </li>
          <li>
            <NavHeader>Admin</NavHeader>
            <ul>
              <li>
                <NavLinkSidebar to={`${projectUrl}/admin`}>
                  <IconInfo />
                  <span>Project Info</span>
                </NavLinkSidebar>
              </li>
              <li>
                <NavLinkSidebar to={`${projectUrl}/users`}>
                  <IconUsers />
                  <span>Users</span>
                </NavLinkSidebar>
              </li>
              {/* hiding for alpha release because leads nowhere useful */}
              {/* <li>
                <NavLinkSidebar to={`${projectUrl}/fish-families`}>
                  <IconFish />
                  <span>Fish Families</span>
                </NavLinkSidebar>
              </li> */}
              <li>
                <NavLinkSidebar to={`${projectUrl}/data-sharing`}>
                  <IconSharing />
                  <span>Data Sharing</span>
                </NavLinkSidebar>
              </li>
            </ul>
          </li>
        </OfflineHide>
      </NavList>
    </NavWrapper>
  )
}

NavMenu.propTypes = {
  subNavNode: subNavNodePropTypes,
}

NavMenu.defaultProps = { subNavNode: null }

export default NavMenu
