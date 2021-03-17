import React from 'react'

import ProjectCard from '.'

export default {
  title: 'ProjectCard',
  component: ProjectCard,
}
export const emptyProjectCard = () => <ProjectCard />

export const populatedProjectCardWith1Site = () => {
  const singleProjectCard = {
    name: 'Gita Nada_MPA 2018',
    country: 'Fiji',
    num_sites: 1,
    offlineReady: false,
    lastUpdatedDate: '11/21/2021',
  }

  return (
    <ProjectCard
      name={singleProjectCard.name}
      country={singleProjectCard.country}
      num_sites={singleProjectCard.num_sites}
      offlineReady={singleProjectCard.offlineReady}
      lastUpdatedDate={singleProjectCard.lastUpdatedDate}
    />
  )
}
export const populatedProjectCardMoreThan1Site = () => {
  const singleProjectCard = {
    name: 'Karimunjawa National Park',
    country: 'Fiji',
    num_sites: 23,
    offlineReady: true,
    lastUpdatedDate: '01/21/2020',
  }

  return (
    <ProjectCard
      name={singleProjectCard.name}
      country={singleProjectCard.country}
      num_sites={singleProjectCard.num_sites}
      offlineReady={singleProjectCard.offlineReady}
      lastUpdatedDate={singleProjectCard.lastUpdatedDate}
    />
  )
}
