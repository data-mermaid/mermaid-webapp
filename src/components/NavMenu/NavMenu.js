import React from 'react'
import styled, { css } from 'styled-components'
import { useParams, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { subNavNodePropTypes } from '../SubNavMenuRecordName/subNavNodePropTypes'
import theme from '../../theme'
import { NavLinkSidebar } from '../generic/links'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import {
  IconCollect,
  IconSites,
  IconData,
  IconMgmt,
  IconAdmin,
  IconUsers,
  IconSharing,
} from '../icons'
import OfflineHide from '../generic/OfflineHide'
import CollectRecordsCount from '../CollectRecordsCount'
import SubNavMenuRecordName from '../SubNavMenuRecordName'

const NavWrapper = styled('nav')`
  background: ${theme.color.white};
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: smaller;
  width: ${theme.spacing.sideNavWidth};
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
        color: ${theme.color.black};
        ${mediaQueryPhoneOnly(css`
          font-size: smaller;
          padding: ${theme.spacing.small} ${theme.spacing.xsmall};
        `)}
      }
    }
  }
`
const NavHeader = styled('p')`
  margin: ${theme.spacing.large} 0 0 0;
  color: ${theme.color.textColor};
  padding: ${theme.spacing.small};
  padding-top: ${theme.spacing.large};
  text-align: center;
  text-transform: uppercase;
  font-weight: 900;
`

const NavMenu = ({ subNavNode }) => {
  const projectUrl = useCurrentProjectPath()
  const { recordId, submittedRecordId, siteId, managementRegimeId } = useParams()
  const { pathname } = useLocation()
  const { projectUserRole } = useCurrentUser()

  const isReadOnlyUser = !(projectUserRole.is_admin || projectUserRole.is_collector)

  const isCollectingSubNode = recordId || pathname.includes('collecting')
  const isSiteSubNode = siteId || pathname.includes('sites')
  const isManagementRegimeSubNode = managementRegimeId || pathname.includes('management-regimes')

  return (
    Object.keys(projectUserRole).length !== 0 && (
      <NavWrapper data-testid="content-page-side-nav">
        <NavList>
          {/* hiding for alpha release because leads nowhere useful */}
          {/* <OfflineHide>
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
        </OfflineHide> */}
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
  )
}

NavMenu.propTypes = {
  subNavNode: subNavNodePropTypes,
}

NavMenu.defaultProps = { subNavNode: null }

export default NavMenu
