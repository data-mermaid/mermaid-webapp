import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import language from '../language'
import { getToastArguments } from '../library/getToastArguments'
import { getCurrentUserProfile, setCurrentUserProfile } from './currentUserProfileHelpers'

export const useInitializeCurrentUser = ({
  apiBaseUrl,
  getAccessToken,
  dexieCurrentUserInstance,
  isMermaidAuthenticated,
  isAppOnline,
}) => {
  const [currentUser, setCurrentUser] = useState()

  const _initializeUserOnAuthentication = useEffect(() => {
    let isMounted = true

    if (isMermaidAuthenticated && apiBaseUrl && dexieCurrentUserInstance) {
      getCurrentUserProfile({
        apiBaseUrl,
        getAccessToken,
        dexieCurrentUserInstance,
        isMermaidAuthenticated,
        isAppOnline,
      })
        .then((user) => {
          if (isMounted && user) {
            setCurrentUser(user)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.userProfileUnavailable))
        })
    }

    return () => {
      isMounted = false
    }
  }, [apiBaseUrl, getAccessToken, dexieCurrentUserInstance, isMermaidAuthenticated, isAppOnline])

  const saveUserProfile = (userProfile) => {
    if (
      isMermaidAuthenticated &&
      apiBaseUrl &&
      dexieCurrentUserInstance &&
      isMermaidAuthenticated
    ) {
      setCurrentUserProfile({
        apiBaseUrl,
        getAccessToken,
        dexieCurrentUserInstance,
        isMermaidAuthenticated,
        isAppOnline,
        userProfile,
      })
        .then((user) => {
          setCurrentUser(user)
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.userProfileUnavailable))
        })
    }
  }

  return { currentUser, saveUserProfile }
}
