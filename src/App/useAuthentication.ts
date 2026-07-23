import { useAuth0 } from '@auth0/auth0-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useOnlineStatus } from '../library/onlineStatusContext'
import pullRequestRedirectAuth0Hack from '../deployUtilities/pullRequestRedirectAuth0Hack'

interface DexieCurrentUserInstance {
  currentUser: {
    delete: (key: string) => Promise<void>
  }
}

interface UseAuthenticationParams {
  dexieCurrentUserInstance: DexieCurrentUserInstance
}

interface UseAuthenticationReturn {
  isMermaidAuthenticated: boolean
  logoutMermaid: () => void
  loginMermaid: () => void
  emailNotVerified: boolean
  getAccessToken: () => Promise<string>
}

const useAuthentication = ({
  dexieCurrentUserInstance,
}: UseAuthenticationParams): UseAuthenticationReturn => {
  const { isAppOnline } = useOnlineStatus()
  const [isMermaidAuthenticated, setIsMermaidAuthenticated] = useState(false)
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const navigate = useNavigate()

  const setAuthenticatedStates = useCallback(() => {
    localStorage.setItem('hasAuth0Authenticated', 'true')
    setIsMermaidAuthenticated(true)
  }, [])

  const setUnauthenticatedStates = useCallback(() => {
    localStorage.removeItem('hasAuth0Authenticated')
    setIsMermaidAuthenticated(false)
  }, [])

  const handlePostLoginRedirect = useCallback(() => {
    const validateReturnPath = (path: string | null): boolean => {
      if (!path) {
        return false
      }

      return path.startsWith('/') && !path.startsWith('//')
    }

    const safeSessionStorageOperation = <T>(operation: () => T): T => operation()

    const returnToPath = safeSessionStorageOperation(() => sessionStorage.getItem('auth0_returnTo'))

    if (returnToPath && returnToPath !== '/' && validateReturnPath(returnToPath)) {
      navigate(returnToPath, { replace: true })
    }

    safeSessionStorageOperation(() => sessionStorage.removeItem('auth0_returnTo'))
  }, [navigate])

  const {
    isAuthenticated: isAuth0Authenticated,
    loginWithRedirect: auth0LoginWithRedirect,
    isLoading: isAuth0Loading,
    logout: auth0Logout,
    getAccessTokenSilently: getAuth0AccessTokenSilently,
  } = useAuth0()

  const _silentAuthentication = useEffect(() => {
    const silentAuth = async () => {
      await getAuth0AccessTokenSilently()
      setAuthenticatedStates()
    }

    if (isAuth0Authenticated && isAppOnline && !isAuth0Loading) {
      silentAuth()
    }
  }, [
    isAuth0Authenticated,
    getAuth0AccessTokenSilently,
    isAppOnline,
    isAuth0Loading,
    setAuthenticatedStates,
  ])

  const _initializeAuthentication = useEffect(() => {
    let isMounted = true
    const auth0CookieName =
      ' ' + `auth0.${import.meta.env.VITE_AUTH0_CLIENT_ID}.is.authenticated=true`

    const auth0CookieExists = document?.cookie?.split(';').includes(auth0CookieName)

    const isOffline = !isAppOnline
    const hasPreviouslyAuthenticated = localStorage.getItem('hasAuth0Authenticated') === 'true'
    const isUserOnlineAndLoggedOut = !isAuth0Authenticated && !isAuth0Loading && isAppOnline
    const isUserOnlineAndLoggedIn = isAuth0Authenticated && !isAuth0Loading && auth0CookieExists

    const isUserOfflineAndLoggedIn = hasPreviouslyAuthenticated && isOffline
    const didUserLogoutFromDashboard = !isAuth0Loading && isAppOnline && !auth0CookieExists

    if (isUserOnlineAndLoggedOut || didUserLogoutFromDashboard) {
      pullRequestRedirectAuth0Hack()
      setUnauthenticatedStates()

      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      if (error && error === 'access_denied') {
        const errorDescription = urlParams.get('error_description')
        if (errorDescription && errorDescription === 'email_not_verified') {
          // Do NOT redirect to Auth0's /login page directly here. That bypasses the
          // OAuth PKCE flow (no redirect_uri/state/code_challenge/nonce), which leaves
          // Auth0 with no valid transaction to complete and produces the
          // "Oops! something went wrong" error page on /login/callback.
          // Instead surface a dedicated screen and let loginMermaid start a proper flow.
          setEmailNotVerified(true)
        }
      } else {
        const { pathname, search } = window.location

        const returnTo = `${pathname}${search}`
        const isValidReturnPath = pathname.startsWith('/') && !pathname.startsWith('//')

        auth0LoginWithRedirect({
          appState: {
            returnTo: isValidReturnPath ? returnTo : '/',
          },
        })
      }
    }

    if (isUserOnlineAndLoggedIn) {
      // this is where logged in state gets set after successful login. (because of redirect)
      getAuth0AccessTokenSilently()
        .then(() => {
          if (isMounted) {
            setAuthenticatedStates()
            handlePostLoginRedirect()
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
    handlePostLoginRedirect,
  ])

  const loginMermaid = useCallback(() => {
    setEmailNotVerified(false)

    const { pathname, search } = window.location
    const isValidReturnPath = pathname.startsWith('/') && !pathname.startsWith('//')

    // Route through the SDK so the full OAuth PKCE flow is initialized
    // (redirect_uri, state, code_challenge, nonce).
    auth0LoginWithRedirect({
      appState: {
        returnTo: isValidReturnPath ? `${pathname}${search}` : '/',
      },
    })
  }, [auth0LoginWithRedirect])

  const logoutMermaid = useCallback(() => {
    if (isAppOnline) {
      sessionStorage.removeItem('auth0_returnTo')

      // this isnt necessary to make logout to work, but is here to make sure users.
      // cant see profile data from the last logged in user if they go searching in dev tools.
      // databaseSwitcboard isnt used because that would create circular dependencies (it depends on the output of this hook)
      dexieCurrentUserInstance.currentUser.delete('enforceOnlyOneRecordEverStoredAndOverwritten')
      auth0Logout({ logoutParams: { returnTo: window.location.origin } })
      setUnauthenticatedStates()
    }
  }, [auth0Logout, setUnauthenticatedStates, dexieCurrentUserInstance.currentUser, isAppOnline])

  return {
    isMermaidAuthenticated,
    logoutMermaid,
    loginMermaid,
    emailNotVerified,
    getAccessToken: getAuth0AccessTokenSilently,
  }
}

export default useAuthentication
