import { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import mockApiService from './mockApiService'

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
  projects: mockApiService.projects,
}

export const useMermaidApi = ({
  isMermaidAuthenticated,
  isOnline,
  authenticatedAxios,
  mermaidDbAccessInstance,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const apiBaseUrl = process.env.REACT_APP_MERMAID_API

  const isOnlineAuthenticatedAndReady =
    isMermaidAuthenticated &&
    isOnline &&
    authenticatedAxios &&
    !!mermaidDbAccessInstance

  const isOfflineAuthenticatedAndReady =
    isMermaidAuthenticated && !isOnline && !!mermaidDbAccessInstance

  const _initializeUserOnAuthentication = useEffect(() => {
    if (isOnlineAuthenticatedAndReady) {
      const getCurrentUserFromApi = authenticatedAxios.get(`${apiBaseUrl}/me`)
      const _addCurrentUserToStateAndOfflineStorage = getCurrentUserFromApi

        .then((apiResults) => {
          const user = apiResults.data

          if (!user) {
            throw Error('User Profile not returned from API')
          }

          dispatch({
            type: 'addUser',
            payload: user,
          })

          return mermaidDbAccessInstance.currentUser.put(user)
        })
        .catch((error) => {
          // toast coming up in other ticket
          console.error('The user profile is unavailable', error)
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

          dispatch({
            type: 'addUser',
            payload: user,
          })
        })
        .catch((error) =>
          // future toast message
          console.error(
            'Could not obtain user profile from offline storage',
            error,
          ),
        )
    }
  }, [
    apiBaseUrl,
    authenticatedAxios,
    isOfflineAuthenticatedAndReady,
    isOnlineAuthenticatedAndReady,
    mermaidDbAccessInstance,
  ])

  return { projects: state.projects, currentUser: state.currentUser }
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
export const mermaidApiServicePropType = PropTypes.shape({
  projects: projectsPropType,
  currentUser: currentUserPropType,
})
