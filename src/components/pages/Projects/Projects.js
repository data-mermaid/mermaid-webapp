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
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { getObjectById } from '../../../library/getObjectById'

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
          toast.error(language.error.projectsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isSyncInProgress])

  const getIsProjectOffline = (projectId) =>
    !!offlineReadyProjectIds.find(
      (offlineProject) => offlineProject.id === projectId,
    )

  const offlineReadyProjects = projects.filter((project) =>
    getObjectById(offlineReadyProjectIds, project.id),
  )

  const getProjectCardsList = (projectsToUse) =>
    projectsToUse.map((project) => (
      <ProjectCard
        role="listitem"
        project={project}
        key={project.id}
        apiSyncInstance={apiSyncInstance}
        isOfflineReady={getIsProjectOffline(project.id)}
      />
    ))

  return isLoading ? (
    <LoadingIndicator aria-label="projects list loading indicator" />
  ) : (
    <HomePageLayout
      topRow={<ProjectToolBarSection />}
      bottomRow={
        <div role="list">
          {isAppOnline
            ? getProjectCardsList(projects)
            : getProjectCardsList(offlineReadyProjects)}
        </div>
      }
    />
  )
}

Projects.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage)
    .isRequired,
}

export default Projects
