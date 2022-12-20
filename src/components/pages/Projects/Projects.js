import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { HomePageLayout } from '../../Layout'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../library/useIsMounted'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import SyncApiDataIntoOfflineStorage from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { getObjectById } from '../../../library/getObjectById'
import PageUnavailable from '../PageUnavailable'
import useDocumentTitle from '../../../library/useDocumentTitle'
import { sortArrayByObjectKey } from '../../../library/arrays/sortArrayByObjectKey'
import ErrorBoundary from '../../ErrorBoundary'

/**
 * All Projects page (lists projects)
 */
const Projects = ({ apiSyncInstance }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [offlineReadyProjectIds, setOfflineReadyProjectIds] = useState([])
  const [projects, setProjects] = useState([])
  const [projectFilter, setProjectFilter] = useState('')
  const [projectSortKey, setProjectSortKey] = useState('name')
  const [isProjectSortAsc, setIsProjectSortAsc] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  useDocumentTitle(`${language.pages.projectsList.title} - ${language.title.mermaid}`)

  const _getProjectsInfo = useEffect(() => {
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
        .catch(() => {
          toast.error(...getToastArguments(language.error.projectsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isSyncInProgress])

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
    const sortedProjects = getSortedProjects(filteredProjects)

    return sortedProjects
  }

  const filteredSortedProjects = getFilteredSortedProjects()

  const addProjectToProjectsPage = (project) => {
    setProjects([...projects, project])
  }

  const renderPageNoData = () => {
    const {
      noFilterResults,
      noFilterResultsSubText,
      noDataSubText,
      noDataMainTextOffline,
      noDataTextOffline,
    } = language.pages.projectsList
    const isProjectFilter = projectFilter !== ''

    let mainText

    let subText

    if (isAppOnline) {
      mainText = isProjectFilter ? noFilterResults : noDataMainTextOffline
      subText = isProjectFilter ? noFilterResultsSubText : noDataSubText
    }

    if (!isAppOnline) {
      mainText = isProjectFilter ? noFilterResults : noDataMainTextOffline
      subText = isProjectFilter ? noFilterResultsSubText : noDataSubText
    }

    return <PageUnavailable mainText={mainText} subText={subText} align="center" />
  }

  const projectCardsList = filteredSortedProjects.length
    ? getFilteredSortedProjects().map((project) => (
        <ErrorBoundary>
          <ProjectCard
            role="listitem"
            project={{ ...project }}
            key={project.id}
            apiSyncInstance={apiSyncInstance}
            isOfflineReady={getIsProjectOffline(project.id)}
            addProjectToProjectsPage={addProjectToProjectsPage}
          />
        </ErrorBoundary>
      ))
    : renderPageNoData()

  return isLoading ? (
    <LoadingIndicator aria-label="projects list loading indicator" />
  ) : (
    <HomePageLayout
      topRow={
        <ProjectToolBarSection
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          projectSortKey={projectSortKey}
          setProjectSortKey={setProjectSortKey}
          isProjectSortAsc={isProjectSortAsc}
          setIsProjectSortAsc={setIsProjectSortAsc}
          addProjectToProjectsPage={addProjectToProjectsPage}
        />
      }
      bottomRow={<div role="list">{projectCardsList}</div>}
    />
  )
}

Projects.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage).isRequired,
}

export default Projects
