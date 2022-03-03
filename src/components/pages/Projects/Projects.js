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
import PageNoData from '../PageNoData'

/**
 * All Projects page (lists projects)
 */
const Projects = ({ apiSyncInstance }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [offlineReadyProjectIds, setOfflineReadyProjectIds] = useState([])
  const [projects, setProjects] = useState([])
  const [projectFilter, setProjectFilter] = useState("")
  const [projectSortKey, setProjectSortKey] = useState("")
  const [isProjectSortAsc, setIsProjectSortAsc] = useState(true)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

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

  const getFilteredSortedProjects = () => {
    let filteredSortedProjects

    if (isAppOnline) {
      filteredSortedProjects = projects
    }

    if (!isAppOnline) {
      filteredSortedProjects = projects.filter((project) =>
        getObjectById(offlineReadyProjectIds, project.id),
      )
    }

    const queryTerms = splitSearchQueryStrings(projectFilter)

    // if (queryTerms && queryTerms.length) {
    //   filteredSortedProjects = filteredSortedProjects.filter((project) => {

    //   })
    // }

    // Filter by filter term (name and country)
    // filteredSortedProjects = filteredSortedProjects.filter()

    // Sort by property asc and desc
    filteredSortedProjects = filteredSortedProjects.sort((a, b) => {
      if (a[projectSortKey] > b[projectSortKey]) { return 1 }
      if (a[projectSortKey] < b[projectSortKey]) { return -1 }

      return 0
    })

    // Reverse array for descending sort
    if (!isProjectSortAsc) { return filteredSortedProjects.reverse() }

    return filteredSortedProjects
  }

  const filteredSortedProjects = getFilteredSortedProjects()

  const projectCardsList = filteredSortedProjects.length ? (
    getFilteredSortedProjects().map((project) => (
      <ProjectCard
        role="listitem"
        project={{ ...project }}
        key={project.id}
        apiSyncInstance={apiSyncInstance}
        isOfflineReady={getIsProjectOffline(project.id)}
      />
    ))
  ) : (
    <PageNoData
      mainText={isAppOnline
        ? language.pages.projectsList.noDataTextOnline
        : language.pages.projectsList.noDataTextOffline}
      subText={isAppOnline
        ? language.pages.projectsList.noDataSubTextOnline
        : language.pages.projectsList.noDataSubTextOffline}
    />
  )

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
        />
      }
      bottomRow={
        <div role="list">{projectCardsList}</div>
      }
    />
  )
}

Projects.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage).isRequired,
}

export default Projects
