import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { getToastArguments } from '../library/getToastArguments'
import { getCurrentUserProfile, setCurrentUserProfile } from './currentUserProfileHelpers'

export const useInitializeCurrentUser = ({
  apiBaseUrl,
  getAccessToken,
  dexieCurrentUserInstance,
  isMermaidAuthenticated,
  isAppOnline,
  handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied,
}) => {
  const { t } = useTranslation()
  const [currentUser, setCurrentUser] = useState()

  const getCurrentUser = useCallback(() => {
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
        .catch((error) => {
          handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied({
            error,
            callback: () => {
              toast.error(...getToastArguments(t('error.user_profile_unavailable')))
            },
          })
        })
    }

    return () => {
      isMounted = false
    }
  }, [
    apiBaseUrl,
    getAccessToken,
    dexieCurrentUserInstance,
    isMermaidAuthenticated,
    isAppOnline,
    handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied,
  ])

  const _initializeUserOnAuthentication = useEffect(getCurrentUser, [getCurrentUser])

  const saveUserProfile = (userProfile) => {
    if (isMermaidAuthenticated && apiBaseUrl && dexieCurrentUserInstance) {
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
        .catch((error) => {
          handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied({
            error,
            callback: () =>
              toast.error(...getToastArguments(t('error.user_profile_unavailable'))),
          })
        })
    }
  }

  return { currentUser, saveUserProfile, refreshCurrentUser: getCurrentUser }
}
