import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

const useAuthentication = ({ isOnline }) => {
  const {
    isAuthenticated: isAuth0Authenticated,
    loginWithRedirect: auth0LoginWithRedirect,
    isLoading: isAuth0Loading,
    logout: auth0Logout,
    getAccessTokenSilently: getAuth0AccessTokenSilently,
  } = useAuth0()
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

  useEffect(() => {
    const isOffline = !isOnline
    const hasPreviouslyAuthenticated =
      localStorage.getItem('hasAuth0Authenticated') === 'true'
    const isAuth0ReadyAndLoggedOut =
      !isAuth0Authenticated && !isAuth0Loading && isOnline
    const isAuth0LoggedIn = isAuth0Authenticated && !isAuth0Loading
    const isUserOfflineAndAuthenticated =
      !isAuth0Authenticated && hasPreviouslyAuthenticated && isOffline

    if (isUserOfflineAndAuthenticated) {
      setIsMermaidAuthenticated(true)
    }
    if (isAuth0ReadyAndLoggedOut) {
      setUnauthenticatedStates()
      auth0LoginWithRedirect()
    }
    if (isAuth0LoggedIn) {
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
  }, [auth0LoginWithRedirect, isAuth0Authenticated, isAuth0Loading, isOnline])

  const logoutMermaid = () => {
    if (isOnline) {
      auth0Logout({ returnTo: window.location.origin })
      setUnauthenticatedStates()
    }
  }

  return { isMermaidAuthenticated, logoutMermaid }
}

export default useAuthentication
