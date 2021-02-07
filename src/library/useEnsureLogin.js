import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

const useEnsureLogin = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect()
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated }
}

export default useEnsureLogin
