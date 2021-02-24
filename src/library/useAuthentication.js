import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

const useAuthentication = ({ isOnline }) => {
  const {
    isAuthenticated: isAuth0Authenticated,
    loginWithRedirect: auth0LoginWithRedirect,
    isLoading: isAuth0Loading,
    logout: auth0Logout,
  } = useAuth0()
  const [isMermaidAuthenticated, setIsMermaidAuthenticated] = useState(false)
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

    if (!isAuth0Authenticated && hasPreviouslyAuthenticated && isOffline) {
      setIsMermaidAuthenticated(true)
    }
    if (!isAuth0Authenticated && !isAuth0Loading && isOnline) {
      setUnauthenticatedStates()
      auth0LoginWithRedirect()
    }
    if (isAuth0Authenticated) {
      // this is where logged in state gets set after successful login. (because of redirect)
      setAuthenticatedStates()
    }
  }, [auth0LoginWithRedirect, isAuth0Authenticated, isAuth0Loading, isOnline])

  const logoutMermaid = () => {
    if (isOnline) {
      auth0Logout()
      setUnauthenticatedStates()
    }
  }

  return { isMermaidAuthenticated, logoutMermaid }
}

export default useAuthentication
