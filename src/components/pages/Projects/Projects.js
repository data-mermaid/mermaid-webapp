import React from 'react'
import SubLayout1 from '../../SubLayout1'
import { mermaidApiServicePropType } from '../../../library/apiServices/useMermaidApi'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'

/**
 * All Projects page (lists projects)
 */
const Projects = ({ apiService }) => {
  const { projects } = apiService

  const projectList = projects.map(
    ({ name, country, numberOfSites, offlineReady, lastUpdatedDate }) => (
      <ProjectCard
        key={name}
        name={name}
        country={country}
        numberOfSites={numberOfSites}
        offlineReady={offlineReady}
        lastUpdatedDate={lastUpdatedDate}
      />
    ),
  )

  return (
    <SubLayout1 topRow={<ProjectToolBarSection />} bottomRow={projectList} />
  )
}

Projects.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default Projects
