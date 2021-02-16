import React from 'react'

import Projects from '.'
import mockApiService from '../../../ApiServices/mockApiService'

export default {
  title: 'Projects',
  component: Projects,
}

export const basic = () => <Projects apiService={mockApiService} />
