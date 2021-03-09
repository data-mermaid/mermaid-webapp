import React from 'react'

import Projects from '.'

import mockMermaidData from '../../../testUtilities/mockMermaidData'

export default {
  title: 'Projects',
  component: Projects,
}

export const basic = () => <Projects apiService={mockMermaidData} />
