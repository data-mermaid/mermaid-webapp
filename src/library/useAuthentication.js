import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

const useAuthentication = ({ isOnline }) => {
  const {
    isAuthenticated: isAuth0Authenticated,
    loginWithRedirect,
    isLoading,
    logout,
  } = useAuth0()
  const [isMermaidAuthenticated, setIsMermaidAuthenticated] = useState(false)
  const isOffline = !isOnline

  useEffect(() => {
    if (
      !isAuth0Authenticated &&
      localStorage.getItem('hasAuth0Authenticated') === 'true' &&
      isOffline
    ) {
      setIsMermaidAuthenticated(true)
    }
    if (!isAuth0Authenticated && !isLoading && isOnline) {
      localStorage.removeItem('hasAuth0Authenticated')
      setIsMermaidAuthenticated(false)
      loginWithRedirect()
    }
    if (isAuth0Authenticated) {
      localStorage.setItem('hasAuth0Authenticated', 'true')
      setIsMermaidAuthenticated(true)
    }
  }, [isAuth0Authenticated, isLoading])

  const logoutMermaid = () => {
    if (isOnline) {
      localStorage.removeItem('hasAuth0Authenticated')
      logout()
      setIsMermaidAuthenticated(false)
    }
  }

  return { isMermaidAuthenticated, logoutMermaid }
}

export default useAuthentication
