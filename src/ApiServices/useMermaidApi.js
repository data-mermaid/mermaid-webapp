import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import mockApiService from './mockApiService'

export const useMermaidApi = ({
  isMermaidAuthenticated,
  isOnline,
  authenticatedAxios,
}) => {
  const [projects] = useState(mockApiService.projects)

  const isOnlineAuthenticated = isMermaidAuthenticated && isOnline
  const isOfflineAuthenticated = isMermaidAuthenticated && !isOnline
  const apiBaseUrl = process.env.REACT_APP_MERMAID_API

  const _initializeUserOnAuthentication = useEffect(() => {
    if (isOnlineAuthenticated && authenticatedAxios) {
      authenticatedAxios
        .get(`${apiBaseUrl}/me`)
        .then((results) => {
          console.log(results.data)
        })
        .catch(() => {
          // toast coming up in other ticket
          console.error('The user profile is unavailable')
        })
    }
    if (isOfflineAuthenticated) {
      // grab from indexeddb
      console.log('offline authed')
    }
  }, [isMermaidAuthenticated, authenticatedAxios])
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
