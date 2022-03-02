import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { HomePageLayout } from '../../Layout'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
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

  const offlineReadyProjects = projects.filter((project) =>
    getObjectById(offlineReadyProjectIds, project.id),
  )

  const projectCardsListOnline = projects.length ? (
    projects.map((project) => (
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
      mainText={language.pages.projectsList.noDataTextOnline}
      subText={language.pages.projectsList.noDataSubTextOnline}
    />
  )

  const projectCardsListOffline = offlineReadyProjects.length ? (
    offlineReadyProjects.map((project) => (
      <ProjectCard
        role="listitem"
        project={project}
        key={project.id}
        apiSyncInstance={apiSyncInstance}
        isOfflineReady={getIsProjectOffline(project.id)}
      />
    ))
  ) : (
    <PageNoData noDataText={language.pages.projectsList.noDataTextOffline} />
  )

  return isLoading ? (
    <LoadingIndicator aria-label="projects list loading indicator" />
  ) : (
    <HomePageLayout
      topRow={<ProjectToolBarSection />}
      bottomRow={
        <div role="list">{isAppOnline ? projectCardsListOnline : projectCardsListOffline}</div>
      }
    />
  )
}

Projects.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage).isRequired,
}

export default Projects
