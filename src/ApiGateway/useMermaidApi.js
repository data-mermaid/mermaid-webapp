import { useState } from 'react'
import PropTypes from 'prop-types'
import mockApiService from './mockApiService'

export const useMermaidApi = () => {
  const [projects] = useState(mockApiService.projects)

  return { projects }
}

export const mermaidApiServicePropType = PropTypes.shape({
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      country: PropTypes.string,
      numberOfSites: PropTypes.number,
      lastUpdatedDate: PropTypes.string,
    }),
  ),
})
