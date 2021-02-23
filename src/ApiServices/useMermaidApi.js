import { useState } from 'react'
import PropTypes from 'prop-types'
import mockApiService from './mockApiService'

export const useMermaidApi = () => {
  const [projects] = useState(mockApiService.projects)
  const [collectRecords] = useState(mockApiService.collectRecords)

  return { projects, collectRecords }
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
  collectRecords: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string,
      site: PropTypes.string,
      management_regime: PropTypes.string,
      data: PropTypes.shape({
        protocol: PropTypes.string,
      }),
      depth: PropTypes.number,
    }),
  ),
})
