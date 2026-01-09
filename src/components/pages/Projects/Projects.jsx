import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'

import { HomePageLayout } from '../../Layout'
import { getToastArguments } from '../../../library/getToastArguments'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../library/useIsMounted'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { getObjectById } from '../../../library/getObjectById'
import PageUnavailable from '../PageUnavailable'
import useDocumentTitle from '../../../library/useDocumentTitle'
import { sortArrayByObjectKey } from '../../../library/arrays/sortArrayByObjectKey'
import ErrorBoundary from '../../ErrorBoundary'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import { openExploreLinkWithBbox } from '../../../library/openExploreLinkWithBbox'
import { useTranslation } from 'react-i18next'

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
  const { currentUser } = useCurrentUser()
  const { t } = useTranslation()
  const unavailableProjectsErrorText = t('projects.errors.data_unavailable')

  useDocumentTitle(`${t('projects.projects')} - ${t('mermaid')}`)
  const userHasDemoProject = projects.some((proj) => proj.is_demo === true)

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
    if (userHasDemoProject) {
      const demoProjIndex = availableProjects.findIndex((project) => project.is_demo === true)

      if (demoProjIndex > -1) {
        const demoProject = availableProjects.splice(demoProjIndex, 1)[0]
        availableProjects.splice(0, 0, demoProject)
      }
    }

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
    const isProjectFilter = projectFilter !== ''

    let mainText

    let subText

    if (isAppOnline) {
      mainText = isProjectFilter ? t('search.no_results') : t('projects.not_your_projects')
      subText = isProjectFilter
        ? t('projects.no_projects_match')
        : t('projects.create_or_join_project')
    }

    if (!isAppOnline) {
      mainText = isProjectFilter ? t('search.no_results') : t('projects.no_offline_projects')
      subText = isProjectFilter
        ? t('projects.no_projects_match')
        : t('projects.create_or_join_project')
    }

    return <PageUnavailable mainText={mainText} subText={subText} align="center" />
  }

  const projectCardsList = filteredSortedProjects.length
    ? getFilteredSortedProjects().map((project) => (
        <ErrorBoundary key={project.id}>
          <ProjectCard
            role="listitem"
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
      bottomRow={<div role="list">{projectCardsList}</div>}
    />
  )
}

export default Projects
