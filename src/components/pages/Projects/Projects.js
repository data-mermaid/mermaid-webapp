import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'

import { HomePageLayout } from '../../Layout'
import language from '../../../language'
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

/**
 * All Projects page (lists projects)
 */
const Projects = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getProjects = useEffect(() => {
    let isMounted = true

    databaseSwitchboardInstance
      .getProjects()
      .then((projectsResponse) => {
        if (isMounted) {
          setIsLoading(false)
          setProjects(projectsResponse)
        }
      })
      .catch(() => {
        toast.error(language.error.projectsUnavailable)
      })

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

  const projectList = projects.map((project) => (
    <ProjectCard role="listitem" project={project} key={project.id} />
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

export default Projects
