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
    ({ name, country, num_sites, offlineReady, updated_on }) => (
      <ProjectCard
        key={name}
        name={name}
        country={country}
        num_sites={num_sites}
        offlineReady={offlineReady}
        updated_on={updated_on}
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
