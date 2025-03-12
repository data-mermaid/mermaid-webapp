import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  CollectionAvatar,
  LiCollecting,
  LiNavPrimary,
  LiNavSecondary,
  NavHeader,
  NavHeaderSecondary,
  NavLinkSidebar,
  NavList,
  NavWrapper,
} from './NavMenu.styles'
import { subNavNodePropTypes } from '../SubNavMenuRecordName/subNavNodePropTypes'
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
  const {
    first_name: currentUserFirstName,
    last_name: currentUserLastName,
    picture: currentUserImageUrl,
  } = currentUser ?? {}

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
                  {currentUserImageUrl || currentUserFirstName || currentUserLastName ? (
                    <CollectionAvatar
                      userImageUrl={currentUserImageUrl}
                      firstName={currentUserFirstName}
                      lastName={currentUserLastName}
                      dark={true}
                    />
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
                  <IconUsersAndTransects />
                  <span>{language.pages.usersAndTransectsTable.navTitle}</span>
                </NavLinkSidebar>
              </li>
              <li>
                <NavLinkSidebar to={`${projectUrl}/management-regimes-overview`}>
                  <IconManagementRegimesOverview />
                  <span>{language.pages.managementRegimesOverview.navTitle}</span>
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
