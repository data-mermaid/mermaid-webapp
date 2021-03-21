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
          if (isMounted && user) {
            dispatch({
              type: 'addUser',
              payload: user,
            })
          }
        })
        .catch(() => {
          toast.error(language.error.userProfileUnavailable)
        })
    }

    return () => {
      isMounted = false
    }
  }, [mermaidDatabaseGatewayInstance])

  return {
    currentUser: state.currentUser,
    sites,
  }
}

export const currentUserPropType = PropTypes.shape({
  id: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  full_name: PropTypes.string,
  email: PropTypes.string,
})
