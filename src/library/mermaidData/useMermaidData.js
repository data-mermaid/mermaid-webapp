import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import axios from 'axios'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import language from '../../language'

const reducer = (state, action) => {
  switch (action.type) {
    case 'addUser':
      return { ...state, currentUser: action.payload }
    default:
      throw new Error()
  }
}

const initialState = {
  currentUser: undefined,
  projects: mockMermaidData.projects,
}

export const useMermaidData = ({
  auth0Token,
  isMermaidAuthenticated,
  isOnline,
  mermaidDbAccessInstance,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [collectRecords] = useState(mockMermaidData.collectRecords)
  const [sites] = useState(mockMermaidData.sites)
  const [managementRegimes] = useState(mockMermaidData.managementRegimes)

  const getCollectRecord = useCallback(
    (searchId) => collectRecords.find((record) => record.id === searchId),
    [collectRecords],
  )

  const apiBaseUrl = process.env.REACT_APP_MERMAID_API
  const authenticatedAxios = useMemo(
    () =>
      axios.create({
        headers: {
          Authorization: `Bearer ${auth0Token}`,
        },
      }),
    [auth0Token],
  )

  const isOnlineAuthenticatedAndReady =
    isMermaidAuthenticated &&
    isOnline &&
    !!auth0Token &&
    !!mermaidDbAccessInstance

  const isOfflineAuthenticatedAndReady =
    isMermaidAuthenticated && !isOnline && !!mermaidDbAccessInstance

  const _initializeUserOnAuthentication = useEffect(() => {
    let isMounted = true

    if (isOnlineAuthenticatedAndReady) {
      const getCurrentUserFromApi = authenticatedAxios.get(`${apiBaseUrl}/me`)
      const _addCurrentUserToStateAndOfflineStorage = getCurrentUserFromApi

        .then((apiResults) => {
          const user = apiResults.data

          if (!user) {
            throw Error('User Profile not returned from API')
          }
          if (isMounted) {
            dispatch({
              type: 'addUser',
              payload: user,
            })
          }

          return mermaidDbAccessInstance.currentUser.put(user)
        })
        .catch(() => {
          toast.error(language.error.userProfileUnavailableApi)
        })
    }
    if (isOfflineAuthenticatedAndReady) {
      const getCurrentUserFromOfflineStorage = mermaidDbAccessInstance.currentUser.toArray()
      const _addCurrentUserToState = getCurrentUserFromOfflineStorage

        .then((results) => {
          const user = results[0]

          if (!user) {
            throw Error('User Profile not returned from offline storage')
          }
          if (isMounted) {
            dispatch({
              type: 'addUser',
              payload: user,
            })
          }
        })
        .catch(() => {
          toast.error(language.error.userProfileUnavailableApi)
        })
    }

    return () => {
      isMounted = false
    }
  }, [
    apiBaseUrl,
    authenticatedAxios,
    isOfflineAuthenticatedAndReady,
    isOnlineAuthenticatedAndReady,
    mermaidDbAccessInstance,
  ])

  return {
    projects: state.projects,
    currentUser: state.currentUser,
    collectRecords,
    sites,
    managementRegimes,
    getCollectRecord,
  }
}
export const projectsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    country: PropTypes.string,
    numberOfSites: PropTypes.number,
    lastUpdatedDate: PropTypes.string,
  }),
)

export const currentUserPropType = PropTypes.shape({
  id: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  full_name: PropTypes.string,
  email: PropTypes.string,
})
export const sitePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  reef_type: PropTypes.string,
  reef_zone: PropTypes.string,
  exposure: PropTypes.string,
})
export const collectRecordPropType = PropTypes.shape({
  method: PropTypes.string,
  site: PropTypes.string,
  management_regime: PropTypes.string,
  data: PropTypes.shape({
    protocol: PropTypes.string,
  }),
  depth: PropTypes.number,
})

export const managementRegimePropType = PropTypes.shape({
  name: PropTypes.string,
})

export const mermaidDataPropType = PropTypes.shape({
  projects: projectsPropType,
  currentUser: currentUserPropType,
  collectRecords: PropTypes.arrayOf(collectRecordPropType),
  sites: PropTypes.arrayOf(sitePropType),
  managementRegimes: PropTypes.arrayOf(managementRegimePropType),
  getCollectRecord: PropTypes.func,
})
