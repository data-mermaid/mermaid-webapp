import React from 'react'

import ProjectName from '.'

export default {
  title: 'ProjectName',
  component: ProjectName,
}

export const basic = () => {
  const pageTitle = 'Project Name'

  return <ProjectName pageTitle={pageTitle} />
}
