import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'

import { databaseGatewayPropTypes } from '../../../App/mermaidData/DatabaseGateway'
import language from '../../../language'
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'
import SubLayout1 from '../../SubLayout1'

/**
 * All Projects page (lists projects)
 */
const Projects = ({ databaseGatewayInstance }) => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getProjects = useEffect(() => {
    databaseGatewayInstance
      .getProjects()
      .then((projectsResponse) => {
        setIsLoading(false)
        setProjects(projectsResponse)
      })
      .catch(() => {
        toast.error(language.error.projectsUnavailable)
      })
  }, [databaseGatewayInstance])

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
    <SubLayout1
      topRow={<ProjectToolBarSection />}
      bottomRow={<div role="list">{projectList}</div>}
    />
  )
}

Projects.propTypes = {
  databaseGatewayInstance: databaseGatewayPropTypes.isRequired,
}

export default Projects
