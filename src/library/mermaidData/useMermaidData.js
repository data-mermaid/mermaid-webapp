import { useEffect, useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
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

export const useMermaidData = ({ mermaidDatabaseGatewayInstance }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [sites] = useState(mockMermaidData.sites)

  const _initializeUserOnAuthentication = useEffect(() => {
    let isMounted = true

    if (mermaidDatabaseGatewayInstance) {
      mermaidDatabaseGatewayInstance
        .getUserProfile()
        .then((user) => {
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
  }, [mermaidDatabaseGatewayInstance])

  return {
    projects: state.projects,
    currentUser: state.currentUser,
    sites,
  }
}
export const projectsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    countries: PropTypes.arrayOf(PropTypes.string),
    num_sites: PropTypes.number,
    updated_on: PropTypes.string,
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
