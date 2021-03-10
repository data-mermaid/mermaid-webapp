import React from 'react'
import SubLayout1 from '../../SubLayout1'

import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import ProjectCard from '../../ProjectCard'
import ProjectToolBarSection from '../../ProjectToolBarSection'

/**
 * All Projects page (lists projects)
 */
const Projects = ({ mermaidData }) => {
  const { projects } = mermaidData

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
  mermaidData: mermaidDataPropType.isRequired,
}

export default Projects
