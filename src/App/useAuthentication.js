import { useAuth0 } from '@auth0/auth0-react'
import { useCallback, useEffect, useState } from 'react'
import { useOnlineStatus } from '../library/onlineStatusContext'
import pullRequestRedirectAuth0Hack from '../deployUtilities/pullRequestRedirectAuth0Hack'

const useAuthentication = ({ dexieCurrentUserInstance }) => {
  const { isAppOnline } = useOnlineStatus()
  const [isMermaidAuthenticated, setIsMermaidAuthenticated] = useState(false)

  const setAuthenticatedStates = useCallback(() => {
    localStorage.setItem('hasAuth0Authenticated', 'true')
    setIsMermaidAuthenticated(true)
  }, [])
  const setUnauthenticatedStates = useCallback(() => {
    localStorage.removeItem('hasAuth0Authenticated')
    setIsMermaidAuthenticated(false)
  }, [])

  const {
    isAuthenticated: isAuth0Authenticated,
    loginWithRedirect: auth0LoginWithRedirect,
    isLoading: isAuth0Loading,
    logout: auth0Logout,
    getAccessTokenSilently: getAuth0AccessTokenSilently,
  } = useAuth0()

  const _initializeAuthentication = useEffect(() => {
    let isMounted = true
    const isOffline = !isAppOnline
    const hasPreviouslyAuthenticated = localStorage.getItem('hasAuth0Authenticated') === 'true'
    const isUserOnlineAndLoggedOut = !isAuth0Authenticated && !isAuth0Loading && isAppOnline
    const isUserOnlineAndLoggedIn = isAuth0Authenticated && !isAuth0Loading
    const isUserOfflineAndLoggedIn = hasPreviouslyAuthenticated && isOffline

    if (isUserOnlineAndLoggedOut) {
      pullRequestRedirectAuth0Hack()
      setUnauthenticatedStates()
      auth0LoginWithRedirect()
    }
    if (isUserOnlineAndLoggedIn) {
      // this is where logged in state gets set after successful login. (because of redirect)
      getAuth0AccessTokenSilently()
        .then(() => {
          if (isMounted) {
            // setAuth0Token(token)
            setAuthenticatedStates()
          }
        })
        .catch((err) => {
          throw Error('Unable to get access token from Auth0', err)
        })
    }
    if (isUserOfflineAndLoggedIn) {
      setIsMermaidAuthenticated(true)
    }

    return () => {
      isMounted = false
    }
  }, [
    auth0LoginWithRedirect,
    getAuth0AccessTokenSilently,
    setAuthenticatedStates,
    setUnauthenticatedStates,
    isAuth0Authenticated,
    isAuth0Loading,
    isAppOnline,
  ])

  const logoutMermaid = useCallback(() => {
    if (isAppOnline) {
      // this isnt necessary to make logout to work, but is here to make sure users.
      // cant see profile data from the last logged in user if they go searching in dev tools.
      // databaseSwitcboard isnt used because that would create circular dependencies (it depends on the output of this hook)
      dexieCurrentUserInstance.currentUser.delete('enforceOnlyOneRecordEverStoredAndOverwritten')
      auth0Logout({ returnTo: window.location.origin })
      setUnauthenticatedStates()
    }
  }, [auth0Logout, setUnauthenticatedStates, dexieCurrentUserInstance.currentUser, isAppOnline])

  return {
    isMermaidAuthenticated,
    logoutMermaid,
    getAccessToken: getAuth0AccessTokenSilently,
  }
}

export default useAuthentication
