import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { HomePageLayout } from '../../Layout'
import language from '../../../language'
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../library/useIsMounted'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import SyncApiDataIntoOfflineStorage from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'

/**
 * All Projects page (lists projects)
 */
const Projects = ({ apiSyncInstance }) => {
  const { isSyncInProgress } = useSyncStatus()
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [offlineReadyProjects, setOfflineReadyProjects] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const isMounted = useIsMounted()

  const _getProjectsInfo = useEffect(() => {
    if (databaseSwitchboardInstance && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getProjects(),
        databaseSwitchboardInstance.getOfflineReadyProjects(),
      ])
        .then(([projectsResponse, offlineReadyProjectsResponse]) => {
          if (isMounted.current) {
            setProjects(projectsResponse)
            setOfflineReadyProjects(offlineReadyProjectsResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.projectsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isSyncInProgress])

  const getIsProjectOffline = (projectId) =>
    !!offlineReadyProjects.find(
      (offlineProject) => offlineProject.id === projectId,
    )

  const projectList = projects.map((project) => (
    <ProjectCard
      role="listitem"
      project={project}
      key={project.id}
      apiSyncInstance={apiSyncInstance}
      isOfflineReady={getIsProjectOffline(project.id)}
    />
  ))

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <HomePageLayout
      topRow={<ProjectToolBarSection />}
      bottomRow={<div role="list">{projectList}</div>}
    />
  )
}

Projects.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage)
    .isRequired,
}

export default Projects
