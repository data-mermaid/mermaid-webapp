import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import pullRequestRedirectAuth0Hack from '../deployUtilities/pullRequestRedirectAuth0Hack'

const useAuthentication = ({ isOnline }) => {
  const [isMermaidAuthenticated, setIsMermaidAuthenticated] = useState(false)
  const [auth0Token, setAuth0Token] = useState()

  const setAuthenticatedStates = () => {
    localStorage.setItem('hasAuth0Authenticated', 'true')
    setIsMermaidAuthenticated(true)
  }
  const setUnauthenticatedStates = () => {
    localStorage.removeItem('hasAuth0Authenticated')
    setIsMermaidAuthenticated(false)
  }

  const {
    isAuthenticated: isAuth0Authenticated,
    loginWithRedirect: auth0LoginWithRedirect,
    isLoading: isAuth0Loading,
    logout: auth0Logout,
    getAccessTokenSilently: getAuth0AccessTokenSilently,
  } = useAuth0()

  const _initializeAuthentication = useEffect(() => {
    const isOffline = !isOnline
    const hasPreviouslyAuthenticated =
      localStorage.getItem('hasAuth0Authenticated') === 'true'
    const isUserOnlineAndLoggedOut =
      !isAuth0Authenticated && !isAuth0Loading && isOnline
    const isUserOnlineAndLoggedIn = isAuth0Authenticated && !isAuth0Loading
    const isUserOfflineAndLoggedIn =
      !isAuth0Authenticated && hasPreviouslyAuthenticated && isOffline

    if (isUserOnlineAndLoggedOut) {
      pullRequestRedirectAuth0Hack()
      setUnauthenticatedStates()
      auth0LoginWithRedirect()
    }
    if (isUserOnlineAndLoggedIn) {
      // this is where logged in state gets set after successful login. (because of redirect)
      setAuthenticatedStates()
      getAuth0AccessTokenSilently()
        .then((token) => {
          setAuth0Token(token)
        })
        .catch((err) => {
          throw Error('Unable to get access token from Auth0', err)
        })
    }
    if (isUserOfflineAndLoggedIn) {
      setIsMermaidAuthenticated(true)
    }
  }, [
    auth0LoginWithRedirect,
    getAuth0AccessTokenSilently,
    isAuth0Authenticated,
    isAuth0Loading,
    isOnline,
  ])

  const logoutMermaid = () => {
    if (isOnline) {
      auth0Logout({ returnTo: window.location.origin })
      setUnauthenticatedStates()
    }
  }

  return {
    isMermaidAuthenticated,
    logoutMermaid,
    auth0Token,
  }
}

export default useAuthentication
