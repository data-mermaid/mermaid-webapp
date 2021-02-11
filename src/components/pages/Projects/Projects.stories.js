import React from 'react'

import Projects from '.'
import ProjectCard from '../../ProjectCard'

export default {
  title: 'Projects',
  component: Projects,
}

export const basic = () => (
  <Projects
    topRow={<>top row stuff goes here</>}
    bottomRow={<>All projects page placeholder</>}
  />
)

export const populatedMultipleProjects = () => {
  const projectSamples = [
    {
      name: 'Karimunjawa National Park',
      country: 'Fiji',
      numberOfSites: 23,
      offlineReady: true,
      lastUpdatedDate: '01/21/2020',
    },
    {
      name: 'Gita Nada_MPA 2018',
      country: 'Fiji',
      numberOfSites: 1,
      offlineReady: false,
      lastUpdatedDate: '11/21/2021',
    },
  ]

  const projectList = projectSamples.map(
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
    <Projects topRow={<>top row stuff goes here</>} bottomRow={projectList} />
  )
}
