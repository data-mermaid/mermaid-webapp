import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import getCurrentUserProfile from '../getCurrentUserProfile'

export const useCurrentUser = ({
  apiBaseUrl,
  auth0Token,
  dexieInstance,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  const [currentUser, setCurrentUser] = useState()

  const _initializeUserOnAuthentication = useEffect(() => {
    let isMounted = true

    if (isMermaidAuthenticated && apiBaseUrl && dexieInstance && isMermaidAuthenticated) {
      getCurrentUserProfile({
        apiBaseUrl,
        auth0Token,
        dexieInstance,
        isMermaidAuthenticated,
        isAppOnline,
      })
        .then((user) => {
          if (isMounted && user) {
            setCurrentUser(user)
          }
        })
        .catch(() => {
          toast.error(
            ...getToastArguments(language.error.userProfileUnavailable)
          )
        })
    }

    return () => {
      isMounted = false
    }
  }, [apiBaseUrl, auth0Token, dexieInstance, isMermaidAuthenticated, isAppOnline])

  return currentUser
}
