import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

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
import { useCurrentProject } from '../../App/CurrentProjectContext'

const NavMenu = ({ subNavNode = null }) => {
  const { t } = useTranslation()

  const projectsUnavailableText = t('projects.errors.data_unavailable')

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
              toast.error(...getToastArguments(projectsUnavailableText))
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
    projectsUnavailableText,
  ])

  return (
    <NavWrapper data-testid="content-page-side-nav">
      <NavList>
        <LiNavPrimary>
          <NavHeader data-testid="nav-header-data">{t('data')}</NavHeader>
          <ul>
            {!isReadOnlyUser && (
              <LiCollecting>
                <NavLinkSidebar end to={`${projectUrl}/collecting`} data-testid="nav-collecting">
                  {currentUserImageUrl || currentUserFirstName || currentUserLastName ? (
                    <CollectionAvatar
                      userImageUrl={currentUserImageUrl}
                      firstName={currentUserFirstName}
                      lastName={currentUserLastName}
                      dark={true}
                    />
                  ) : null}
                  <IconCollect />
                  <span>{t('sample_units.collecting')}</span>
                  <CollectRecordsCount />
                </NavLinkSidebar>
              </LiCollecting>
            )}
            {isCollectingSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
            <OfflineHide>
              <li>
                <NavLinkSidebar end to={`${projectUrl}/submitted`} data-testid="nav-submitted">
                  <IconData />
                  <span>{t('sample_units.submitted')}</span>
                </NavLinkSidebar>
              </li>
              {submittedRecordId && <SubNavMenuRecordName subNavNode={subNavNode} />}
            </OfflineHide>
          </ul>
        </LiNavPrimary>
        <LiNavSecondary>
          <NavHeaderSecondary data-testid="nav-header-metadata">{t('metadata')}</NavHeaderSecondary>
          <ul>
            <li>
              <NavLinkSidebar end to={`${projectUrl}/sites`} data-testid="nav-sites">
                <IconSites />
                <span>{t('sites.sites')}</span>
              </NavLinkSidebar>
            </li>
            {isSiteSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
            <li>
              <NavLinkSidebar
                end
                to={`${projectUrl}/management-regimes`}
                data-testid="nav-management-regimes"
              >
                <IconMgmt />
                <span>{t('management_regimes.management_regimes')}</span>
              </NavLinkSidebar>
            </li>
            {isManagementRegimeSubNode && <SubNavMenuRecordName subNavNode={subNavNode} />}
          </ul>
        </LiNavSecondary>
        <OfflineHide>
          <LiNavSecondary>
            <NavHeaderSecondary data-testid="nav-header-overview">
              {t('overview')}
            </NavHeaderSecondary>
            <ul>
              <li>
                <NavLinkSidebar
                  to={`${projectUrl}/observers-and-transects`}
                  data-testid="nav-observers-transects"
                >
                  <IconUsersAndTransects />
                  <span>{t('sample_units_and_observers')}</span>
                </NavLinkSidebar>
              </li>
              <li>
                <NavLinkSidebar
                  to={`${projectUrl}/management-regimes-overview`}
                  data-testid="nav-management-regimes-overview"
                >
                  <IconManagementRegimesOverview />
                  <span>{t('sample_units_and_management_regimes')}</span>
                </NavLinkSidebar>
              </li>
            </ul>
          </LiNavSecondary>
          <LiNavSecondary>
            <NavHeaderSecondary data-testid="nav-header-admin">{t('admin')}</NavHeaderSecondary>
            <ul>
              <li>
                <NavLinkSidebar to={`${projectUrl}/project-info`} data-testid="nav-project-info">
                  <IconInfo />
                  <span>{t('project_info')}</span>
                </NavLinkSidebar>
              </li>
              <li>
                <NavLinkSidebar to={`${projectUrl}/users`} data-testid="nav-users">
                  <IconUsers />
                  <span>{t('users.users')}</span>
                </NavLinkSidebar>
              </li>
              <li>
                <NavLinkSidebar to={`${projectUrl}/data-sharing`} data-testid="nav-data-sharing">
                  <IconSharing />
                  <span>{t('data_sharing.data_sharing')}</span>
                </NavLinkSidebar>
              </li>
              <OfflineHide>
                <li>
                  {currentProject?.includes_gfcr && (
                    <NavLinkSidebar to={`${projectUrl}/gfcr`} data-testid="nav-gfcr">
                      <IconGfcr />
                      <span>{t('gfcr.gfcr')}</span>
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
