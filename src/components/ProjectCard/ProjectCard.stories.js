import React from 'react'

import ProjectCard from '.'

export default {
  title: 'ProjectCard',
  component: ProjectCard,
}
export const emptyProjectCard = () => <ProjectCard />

export const populatedProjectCardWith1Site = () => {
  const singleProjectCard = {
    project_name: 'Gita Nada_MPA 2018',
    country: 'Fiji',
    number_of_sites: 1,
    offline_ready: false,
    last_updated_date: '11/21/2021',
  }

  return (
    <ProjectCard
      project_name={singleProjectCard.project_name}
      country={singleProjectCard.country}
      number_of_sites={singleProjectCard.number_of_sites}
      offline_ready={singleProjectCard.offline_ready}
      last_updated_date={singleProjectCard.last_updated_date}
    />
  )
}
export const populatedProjectCardMoreThan1Site = () => {
  const singleProjectCard = {
    project_name: 'Gita Nada_MPA 2018',
    country: 'Fiji',
    number_of_sites: 23,
    offline_ready: true,
    last_updated_date: '01/21/2020',
  }

  return (
    <ProjectCard
      project_name={singleProjectCard.project_name}
      country={singleProjectCard.country}
      number_of_sites={singleProjectCard.number_of_sites}
      offline_ready={singleProjectCard.offline_ready}
      last_updated_date={singleProjectCard.last_updated_date}
    />
  )
}
