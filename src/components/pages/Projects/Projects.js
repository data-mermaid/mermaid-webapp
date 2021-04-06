import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'

import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard'
import language from '../../../language'
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'
import HomePageLayout from '../../HomePageLayout'

/**
 * All Projects page (lists projects)
 */
const Projects = ({ databaseSwitchboardInstance }) => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getProjects = useEffect(() => {
    databaseSwitchboardInstance
      .getProjects()
      .then((projectsResponse) => {
        setIsLoading(false)
        setProjects(projectsResponse)
      })
      .catch(() => {
        toast.error(language.error.projectsUnavailable)
      })
  }, [databaseSwitchboardInstance])

  const projectList = projects.map(
    ({ name, countries, num_sites, offlineReady, updated_on }) => (
      <ProjectCard
        role="listitem"
        key={name}
        name={name}
        countries={countries}
        num_sites={num_sites}
        offlineReady={offlineReady}
        updated_on={updated_on}
      />
    ),
  )

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
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default Projects
