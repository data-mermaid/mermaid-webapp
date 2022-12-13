import React from 'react'
import styled, { css } from 'styled-components'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import { subNavNodePropTypes } from '../SubNavMenuRecordName/subNavNodePropTypes'
import theme from '../../theme'
import { mediaQueryPhoneOnly, hoverState } from '../../library/styling/mediaQueries'
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
import { getIsReadOnlyUserRole } from '../../App/currentUserProfileHelpers'
import OfflineHide from '../generic/OfflineHide'
import CollectRecordsCount from '../CollectRecordsCount'
import SubNavMenuRecordName from '../SubNavMenuRecordName'

const NavWrapper = styled('nav')`
  background: ${theme.color.grey4};
  height: 100%;
  width: ${theme.spacing.sideNavWidth};
  ${mediaQueryPhoneOnly(css`
    width: ${theme.spacing.mobileSideNavWidth};
    font-size: ${theme.typography.xSmallFontSize};
  `)}
`
const LiCollecting = styled('li')`
  border-style: solid;
  border-color: ${theme.color.primaryColor};
  border-width: 2px 0;
  position: relative;
`
const CollectionAvatar = styled('img')`
  border-radius: 50%;
  position: absolute;
  right: 1rem;
  top: -1.75rem;
  border: solid 2px ${theme.color.primaryColor};
  width: 32px;
  aspect-ratio: 1 / 1;
  z-index: 1;
`
const LiNavPrimary = styled('li')`
  background: ${theme.color.white};
  font-size: larger;
  p {
    font-size: 2.4rem;
  }
`
const LiNavSecondary = styled('li')`
  background: ${theme.color.grey4};
  font-size: smaller;
  p {
    font-size: 1.4rem;
  }
`
const NavList = styled('ul')`
  position: sticky;
  top: ${theme.spacing.headerHeight};
  padding: 0;
  margin: 0;
  & ul {
    padding: 0;
    li {
      a {
        font-size: inherit;
        color: inherit;
        ${mediaQueryPhoneOnly(css`
          padding: ${theme.spacing.small} ${theme.spacing.xsmall};
        `)}
      }
    }
  }
`

const NavHeader = styled('p')`
  margin: 0;
  color: ${theme.color.textColor};
  padding: ${theme.spacing.large} 0 0 ${theme.spacing.medium};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 900;
  ${mediaQueryPhoneOnly(css`
    padding-left: 0;
    font-size: ${theme.typography.xSmallFontSize};
  `)}
`
const NavLinkSidebar = styled(NavLink)`
  padding: ${theme.spacing.small};
  text-decoration: none;
  display: grid;
  grid-template-columns: 3rem auto;
  align-items: baseline;
  ${theme.typography.noWordBreak};
  ${hoverState(css`
    background-color: ${theme.color.primaryHover};
    color: ${theme.color.white};
  `)}
  &:active {
    background-color: ${theme.color.primaryActive};
  }
  & > svg {
    margin: ${theme.spacing.small};
  }
  &.active {
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  }
  span {
    white-space: break-spaces;
  }
  ${mediaQueryPhoneOnly(css`
    padding: 0 ${theme.spacing.small};
    display: block;
    svg {
      display: none;
    }
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
  const isReadOnlyUser = getIsReadOnlyUserRole(currentUser, projectId)

  return (
    <NavWrapper data-testid="content-page-side-nav">
      <NavList>
        <LiNavPrimary>
          <NavHeader>Data</NavHeader>
          <ul>
            {!isReadOnlyUser && (
              <LiCollecting>
                <NavLinkSidebar exact to={`${projectUrl}/collecting`}>
                  <CollectionAvatar src="https://picsum.photos/seed/picsum/100/100" />
                  <IconCollect />
                  <span>Collecting</span>
                  <CollectRecordsCount />
                </NavLinkSidebar>
              </LiCollecting>
            )}
            {isCollectingSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
            <OfflineHide>
              <li>
                <NavLinkSidebar exact to={`${projectUrl}/submitted`}>
                  <IconData />
                  <span>Submitted</span>
                </NavLinkSidebar>
              </li>
              {submittedRecordId && <SubNavMenuRecordName subNavNode={subNavNode} />}
            </OfflineHide>
          </ul>
        </LiNavPrimary>
        <LiNavSecondary>
          <NavHeader>Metadata</NavHeader>
          <ul>
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
        </LiNavSecondary>
        <OfflineHide>
          <LiNavSecondary>
            <NavHeader>Overview</NavHeader>
            <ul>
              <li>
                <NavLinkSidebar to={`${projectUrl}/users-and-transects`}>
                  <IconUsersAndTransects /> <span>Users and Transects</span>
                </NavLinkSidebar>
              </li>
              <li>
                <NavLinkSidebar to={`${projectUrl}/management-regimes-overview`}>
                  <IconManagementRegimesOverview /> <span>Management Regimes Overview</span>
                </NavLinkSidebar>
              </li>
            </ul>
          </LiNavSecondary>
          <LiNavSecondary>
            <NavHeader>Admin</NavHeader>
            <ul>
              <li>
                <NavLinkSidebar to={`${projectUrl}/project-info`}>
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
              <li>
                <NavLinkSidebar to={`${projectUrl}/data-sharing`}>
                  <IconSharing />
                  <span>Data Sharing</span>
                </NavLinkSidebar>
              </li>
            </ul>
          </LiNavSecondary>
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
