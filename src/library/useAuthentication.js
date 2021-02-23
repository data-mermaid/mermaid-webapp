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

  useEffect(() => {
    const isOffline = !isOnline
    const hasPreviouslyAuthenticated =
      localStorage.getItem('hasAuth0Authenticated') === 'true'

    if (!isAuth0Authenticated && hasPreviouslyAuthenticated && isOffline) {
      setIsMermaidAuthenticated(true)
    }
    if (!isAuth0Authenticated && !isAuth0Loading && isOnline) {
      localStorage.removeItem('hasAuth0Authenticated')
      setIsMermaidAuthenticated(false)
      auth0LoginWithRedirect()
    }
    if (isAuth0Authenticated) {
      localStorage.setItem('hasAuth0Authenticated', 'true')
      setIsMermaidAuthenticated(true)
    }
  }, [isAuth0Authenticated, isAuth0Loading, isOnline, auth0LoginWithRedirect])

  const auth0LogoutMermaid = () => {
    if (isOnline) {
      localStorage.removeItem('hasAuth0Authenticated')
      auth0Logout()
      setIsMermaidAuthenticated(false)
    }
  }

  return { isMermaidAuthenticated, auth0LogoutMermaid }
}

export default useAuthentication
