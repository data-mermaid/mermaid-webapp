import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { subNavNodePropTypes } from '../SubNavMenuRecordName/subNavNodePropTypes'
import theme from '../../theme'
import { mediaQueryPhoneOnly, hoverState } from '../../library/styling/mediaQueries'
import { useCurrentUser } from '../../App/CurrentUserContext'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import {
  IconCollect,
  IconSites,
  IconData,
  IconGfcr,
  IconMgmt,
  IconInfo,
  IconUsers,
  IconSharing,
  IconUsersAndTransects,
  IconManagementRegimesOverview,
} from '../icons'
import { getIsUserReadOnlyForProject } from '../../App/currentUserProfileHelpers'
import OfflineHide from '../generic/OfflineHide'
import CollectRecordsCount from '../CollectRecordsCount'
import SubNavMenuRecordName from '../SubNavMenuRecordName'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import useIsMounted from '../../library/useIsMounted'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { getToastArguments } from '../../library/getToastArguments'
import language from '../../language'
import { useCurrentProject } from '../../App/CurrentProjectContext'

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
  ${mediaQueryPhoneOnly(css`
    border: none;
  `)}
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
  ${mediaQueryPhoneOnly(css`
    display: none;
  `)}
`
const LiNavPrimary = styled('li')`
  background: ${theme.color.white};
  font-size: ${theme.typography.defaultFontSize};
  font-weight: 700;
  ${mediaQueryPhoneOnly(css`
    font-size: 1.2rem;
  `)}
`
const LiNavSecondary = styled('li')`
  background: ${theme.color.grey4};
  font-size: ${theme.typography.smallFontSize};
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
  padding: ${theme.spacing.large} 0 ${theme.spacing.medium} ${theme.spacing.medium};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-size: ${theme.typography.largeFontSize};
  ${mediaQueryPhoneOnly(css`
    font-size: ${theme.typography.defaultFontSize};
    padding-left: ${theme.spacing.xsmall};
  `)}
`
const NavHeaderSecondary = styled(NavHeader)`
  font-size: 1.4rem;
  ${mediaQueryPhoneOnly(css`
    font-size: 1.2rem;
    letter-spacing: 1px;
  `)}
`
const NavLinkSidebar = styled(NavLink)`
  padding: 0.75rem ${theme.spacing.small};
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
    margin: 0.25rem ${theme.spacing.small} 0 ${theme.spacing.small};
  }
  &.active {
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  }
  ${mediaQueryPhoneOnly(css`
    display: block;
    svg {
      display: none;
    }
  `)}
`

const NavMenu = ({ subNavNode = null }) => {
  const projectUrl = useCurrentProjectPath()
  const { recordId, submittedRecordId, siteId, managementRegimeId, projectId, indicatorSetId } =
    useParams()
  const { pathname } = useLocation()
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const { isAppOnline } = useOnlineStatus()
  const isMounted = useIsMounted()
  const isCollectingSubNode = recordId || pathname.includes('collecting')
  const isSiteSubNode = siteId || pathname.includes('sites')
  const isGfcrSubNode = indicatorSetId || pathname.includes('gfcr')
  const isManagementRegimeSubNode = managementRegimeId || pathname.includes('management-regimes')
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)

  const { currentProject, setCurrentProject } = useCurrentProject()

  const handleImageError = (event) => {
    // eslint-disable-next-line no-param-reassign
    event.target.style.display = 'none'
  }

  const _getProjectData = useEffect(() => {
    if (!currentProject && isAppOnline && databaseSwitchboardInstance && projectId) {
      const promises = [databaseSwitchboardInstance.getProject(projectId)]

      Promise.all(promises)
        .then(([projectResponse]) => {
          if (isMounted.current) {
            // This is set back to undefined in Layout.js if pathname === '/projects'
            setCurrentProject(projectResponse)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.projectsUnavailable))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    projectId,
    isMounted,
    isAppOnline,
    handleHttpResponseError,
    setCurrentProject,
    currentProject,
  ])

  return (
    <NavWrapper data-testid="content-page-side-nav">
      <NavList>
        <LiNavPrimary>
          <NavHeader>Data</NavHeader>
          <ul>
            {!isReadOnlyUser && (
              <LiCollecting>
                <NavLinkSidebar end to={`${projectUrl}/collecting`}>
                  {currentUser.picture ? (
                    <CollectionAvatar src={currentUser.picture} onError={handleImageError} />
                  ) : null}
                  <IconCollect />
                  <span>Collecting</span>
                  <CollectRecordsCount />
                </NavLinkSidebar>
              </LiCollecting>
            )}
            {isCollectingSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
            <OfflineHide>
              <li>
                <NavLinkSidebar end to={`${projectUrl}/submitted`}>
                  <IconData />
                  <span>Submitted</span>
                </NavLinkSidebar>
              </li>
              {submittedRecordId && <SubNavMenuRecordName subNavNode={subNavNode} />}
            </OfflineHide>
          </ul>
        </LiNavPrimary>
        <LiNavSecondary>
          <NavHeaderSecondary>Metadata</NavHeaderSecondary>
          <ul>
            <li>
              <NavLinkSidebar end to={`${projectUrl}/sites`}>
                <IconSites />
                <span>Sites</span>
              </NavLinkSidebar>
            </li>
            {isSiteSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
            <li>
              <NavLinkSidebar end to={`${projectUrl}/management-regimes`}>
                <IconMgmt />
                <span>Management Regimes</span>
              </NavLinkSidebar>
            </li>
            {isManagementRegimeSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
          </ul>
        </LiNavSecondary>
        <OfflineHide>
          <LiNavSecondary>
            <NavHeaderSecondary>Overview</NavHeaderSecondary>
            <ul>
              <li>
                <NavLinkSidebar to={`${projectUrl}/observers-and-transects`}>
                  <IconUsersAndTransects /> <span>Observers and Transects</span>
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
            <NavHeaderSecondary>Admin</NavHeaderSecondary>
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
              <OfflineHide>
                <li>
                  {currentProject?.includes_gfcr && (
                    <NavLinkSidebar to={`${projectUrl}/gfcr`}>
                      <IconGfcr />
                      <span>GFCR</span>
                    </NavLinkSidebar>
                  )}
                </li>
              </OfflineHide>
              {isGfcrSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
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

export default NavMenu
