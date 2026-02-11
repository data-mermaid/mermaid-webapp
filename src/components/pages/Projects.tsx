import { toast } from 'react-toastify'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { HomePageLayout } from '../Layout'
import { getToastArguments } from '../../library/getToastArguments'
import { splitSearchQueryStrings } from '../../library/splitSearchQueryStrings'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'
import ProjectCard from '../ProjectCard'
import ProjectToolBarSection from '../ProjectToolBarSection'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../library/useIsMounted'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { getObjectById } from '../../library/getObjectById'
import PageUnavailable from './PageUnavailable'
import useDocumentTitle from '../../library/useDocumentTitle'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import ErrorBoundary from '../ErrorBoundary'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { openExploreLinkWithBbox } from '../../library/openExploreLinkWithBbox'
import { useTranslation } from 'react-i18next'
import CalloutButton from '../generic/CalloutButton/CalloutButton'
import { CloseButton } from '../generic/buttons'
import { Box } from '@mui/material'
import { IconClose } from '../icons'
import cardStyles from '../ProjectCard/ProjectCard.module.scss'
import { useNavigate } from 'react-router-dom'
import { internalNavigation } from '../../link_constants'

interface DemoProjectCalloutProps {
  handleDemoClick: () => void
  updateUserSettings: (setting: string, val: boolean) => void
  userHasProjects: boolean
  setIsDemoCalloutVisible: Dispatch<SetStateAction<boolean>>
}
const DemoProjectCallout = ({
  handleDemoClick,
  updateUserSettings,
  userHasProjects,
  setIsDemoCalloutVisible,
}: DemoProjectCalloutProps) => {
  const { t } = useTranslation()
  const calloutStyleClasses = userHasProjects
    ? cardStyles['demo-callout']
    : cardStyles['demo-callout--centered']

  const handleDemoTryoutDismiss = () => {
    setIsDemoCalloutVisible(false)
    updateUserSettings('hasUserDismissedDemo', true)
    toast.info(t('projects.demo.dismissed'))
  }

  return (
    <Box data-testid="demo-project-callout" className={calloutStyleClasses}>
      <div>
        <h2>{t('projects.demo.tryout')}</h2>
        <p>{t('projects.demo.teaser')}</p>
      </div>
      <div>
        <CalloutButton
          onClick={handleDemoClick}
          aria-label={t('projects.buttons.add_demo')}
          disabled={false}
          testId="demo-project-button"
          label={t('projects.buttons.add_demo')}
        />
        {userHasProjects && (
          <CloseButton
            type="button"
            onClick={handleDemoTryoutDismiss}
            data-testid="callout-close-button"
          >
            <IconClose aria-label={t('buttons.close')} />
          </CloseButton>
        )}
      </div>
    </Box>
  )
}

/**
 * All Projects page (lists projects)
 */
const Projects = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isProjectSortAsc, setIsProjectSortAsc] = useState(false)
  const [offlineReadyProjectIds, setOfflineReadyProjectIds] = useState([])
  const [projectFilter, setProjectFilter] = useState('')
  const [projects, setProjects] = useState([])
  const [projectSortKey, setProjectSortKey] = useState('updated_on')
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isMounted = useIsMounted()
  const { currentUser, refreshCurrentUser, saveUserProfile } = useCurrentUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const unavailableProjectsErrorText = t('projects.errors.data_unavailable')

  useDocumentTitle(`${t('projects.projects')} - ${t('mermaid')}`)
  const userHasProjects = projects.length > 0

  const hasUserDismissedDemo = currentUser.collect_state?.hasUserDismissedDemo ?? false
  const userHasDemoProject = projects.some((proj) => proj.is_demo === true)
  const [isDemoCalloutVisible, setIsDemoCalloutVisible] = useState(
    !userHasDemoProject && !hasUserDismissedDemo && isAppOnline,
  )

  useEffect(() => {
    if (databaseSwitchboardInstance && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getProjects(),
        databaseSwitchboardInstance.getOfflineReadyProjectIds(),
      ])
        .then(([projectsResponse, offlineReadyProjectIdsResponse]) => {
          if (isMounted.current) {
            setProjects(projectsResponse)
            setOfflineReadyProjectIds(offlineReadyProjectIdsResponse)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(unavailableProjectsErrorText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isSyncInProgress,
    handleHttpResponseError,
    unavailableProjectsErrorText,
  ])

  const updateUserSettings = (setting: string, val: boolean) => {
    const updatedProfileSettings = { [setting]: val }
    saveUserProfile({
      ...currentUser,
      collect_state: { ...currentUser.collect_state, ...updatedProfileSettings },
    })
  }

  const createDemoProject = () => {
    setIsLoading(true)
    databaseSwitchboardInstance
      .addDemoProject()
      .then((response) => {
        updateUserSettings('hasUserDismissedDemo', true)
        refreshCurrentUser() // ensures correct user privileges
        toast.success(...getToastArguments(t('projects.demo.created')))
        setIsLoading(false)
        navigate(internalNavigation.projectStartPage(response.id))
      })
      .catch((error) => {
        const isDuplicateError = error.response?.status === 400
        setIsLoading(false)

        handleHttpResponseError({
          error,
          callback: () => {
            if (isDuplicateError) {
              toast.error(...getToastArguments(t('api_errors.demo_project_exists')))
            }
          },
        })
      })
  }

  const getIsProjectOffline = (projectId) =>
    !!offlineReadyProjectIds.find((offlineProject) => offlineProject.id === projectId)

  const getAvailableProjects = () => {
    if (isAppOnline) {
      return projects
    }

    return projects.filter((project) => getObjectById(offlineReadyProjectIds, project.id))
  }

  const getFilteredProjects = (projectsToFilter) => {
    const queryTerms = splitSearchQueryStrings(projectFilter)

    if (queryTerms && queryTerms.length) {
      const filterKeys = ['name', 'countries']

      return projectsToFilter.filter((project) => {
        return filterKeys.some((key) => {
          return queryTerms.some((term) => term.test(project[key].toString()))
        })
      })
    }

    return projectsToFilter
  }

  const getSortedProjects = (projectsToSort) => {
    return sortArrayByObjectKey(projectsToSort, projectSortKey, isProjectSortAsc)
  }

  const getFilteredSortedProjects = () => {
    const availableProjects = getAvailableProjects()
    const filteredProjects = getFilteredProjects(availableProjects)
    return getSortedProjects(filteredProjects)
  }

  const filteredSortedProjects = getFilteredSortedProjects()

  const addProjectToProjectsPage = (project) => {
    setProjects([...projects, project])
  }

  const handleExploreButtonClick = () => {
    const queryParamObject = {
      your_projects_only: true,
      bbox: currentUser?.projects_bbox,
    }

    openExploreLinkWithBbox(queryParamObject)
  }

  const renderPageNoData = () => {
    const isProjectFilterApplied = projectFilter !== ''
    let mainText, subText

    if (isProjectFilterApplied) {
      mainText = t('search.no_results')
      subText = t('projects.no_projects_match')
    } else if (isAppOnline) {
      mainText = t('projects.no_projects')
      subText = t('projects.create_or_join_project')
    } else {
      mainText = t('projects.no_offline_projects')
      subText = ''
    }

    return <PageUnavailable mainText={mainText} subText={subText} align="center" />
  }

  const projectCardsList = filteredSortedProjects.length
    ? getFilteredSortedProjects().map((project) => (
        <ErrorBoundary key={project.id}>
          <ProjectCard
            project={{ ...project }}
            isOfflineReady={getIsProjectOffline(project.id)}
            addProjectToProjectsPage={addProjectToProjectsPage}
          />
        </ErrorBoundary>
      ))
    : renderPageNoData()

  return isLoading ? (
    <LoadingIndicator
      aria-label={t('projects.loading_indicator')}
      data-testid="projects-loading-indicator"
    />
  ) : (
    <HomePageLayout
      topRow={
        <ProjectToolBarSection
          setProjectFilter={setProjectFilter}
          projectSortKey={projectSortKey}
          setProjectSortKey={setProjectSortKey}
          setIsProjectSortAsc={setIsProjectSortAsc}
          addProjectToProjectsPage={addProjectToProjectsPage}
          handleExploreButtonClick={handleExploreButtonClick}
          userHasDemoProject={userHasDemoProject}
        />
      }
      bottomRow={
        <div role="list">
          {isDemoCalloutVisible && (
            <DemoProjectCallout
              updateUserSettings={updateUserSettings}
              handleDemoClick={createDemoProject}
              userHasProjects={userHasProjects}
              setIsDemoCalloutVisible={setIsDemoCalloutVisible}
            />
          )}
          {projectCardsList}
        </div>
      }
    />
  )
}

export default Projects
