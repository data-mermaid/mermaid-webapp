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
    countries: 'Fiji',
    num_sites: 1,
    offlineReady: false,
    updated_on: '11/21/2021',
  }

  return (
    <ProjectCard
      name={singleProjectCard.name}
      countries={singleProjectCard.countries}
      num_sites={singleProjectCard.num_sites}
      offlineReady={singleProjectCard.offlineReady}
      updated_on={singleProjectCard.updated_on}
    />
  )
}
export const populatedProjectCardMoreThan1Site = () => {
  const singleProjectCard = {
    name: 'Karimunjawa National Park',
    countries: 'Fiji',
    num_sites: 23,
    offlineReady: true,
    updated_on: '01/21/2020',
  }

  return (
    <ProjectCard
      name={singleProjectCard.name}
      countries={singleProjectCard.countries}
      num_sites={singleProjectCard.num_sites}
      offlineReady={singleProjectCard.offlineReady}
      updated_on={singleProjectCard.updated_on}
    />
  )
}
