import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import language from '../../../language'
import { getProjectIdFromLocation } from '../../../library/getProjectIdFromLocation'
import { getToastArguments } from '../../../library/getToastArguments'
import { useSyncStatus } from './SyncStatusContext'

export const useInitializeSyncApiDataIntoOfflineStorage = ({
  apiBaseUrl,
  dexiePerUserDataInstance,
  isMounted,
  isAppOnline,
  handleHttpResponseError,
  syncApiDataIntoOfflineStorage,
  refreshCurrentUser,
}) => {
  const location = useLocation()
  const isPageReload = useRef(true)

  const { setIsSyncInProgress, setIsOfflineStorageHydrated, setSyncErrors } = useSyncStatus()

  const isOnlineAndReady =
    apiBaseUrl && dexiePerUserDataInstance && isMounted.current && isAppOnline

  const projectId = getProjectIdFromLocation(location)

  const isProjectPage = !!projectId

  const isOfflineAndReadyAndAlreadyInitiated =
    apiBaseUrl && dexiePerUserDataInstance && isMounted.current && !isAppOnline

  const isProjectsListPage = location.pathname === '/projects' || location.pathname === '/projects/'

  const isUserDeniedProjectAccessPage = location.pathname.includes('noProjectAccess')

  const isProjectsListPageAndOnline = isProjectsListPage && isOnlineAndReady

  const _conditionallySyncOfflineStorageWithApiDataForProjectListPage = useEffect(() => {
    const resetSyncErrors = () => {
      setSyncErrors([])
    }
    const appendSyncError = (newError) => {
      setSyncErrors((previousState) => [...previousState, newError])
    }

    if (isOfflineAndReadyAndAlreadyInitiated || isUserDeniedProjectAccessPage) {
      setIsOfflineStorageHydrated(true)
      setIsSyncInProgress(false)
    }

    if (isProjectsListPageAndOnline) {
      // this captures when a user returns to being online after being offline
      refreshCurrentUser() // this ensures accurate info in project card summaries (eg, active sample units for a user, which is stored in the user profile)
      setIsSyncInProgress(true)
      resetSyncErrors()
      syncApiDataIntoOfflineStorage
        .pushThenPullEverything()
        .then(() => {
          if (isMounted.current) {
            setIsOfflineStorageHydrated(true)
            setIsSyncInProgress(false)
            isPageReload.current = false
          }
        })
        .catch((error) => {
          setIsSyncInProgress(false)
          appendSyncError(language.error.apiDataSync)
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.apiDataSync))
            },
          })
        })
    }
  }, [
    handleHttpResponseError,
    isMounted,
    isOfflineAndReadyAndAlreadyInitiated,
    isProjectsListPageAndOnline,
    isUserDeniedProjectAccessPage,
    refreshCurrentUser,
    setIsOfflineStorageHydrated,
    setIsSyncInProgress,
    setSyncErrors,
    syncApiDataIntoOfflineStorage,
  ])

  const _conditionallySyncOfflineStorageWithApiDataForProjectPages = useEffect(() => {
    const resetSyncErrors = () => {
      setSyncErrors([])
    }
    const appendSyncError = (newError) => {
      setSyncErrors((previousState) => [...previousState, newError])
    }

    const isInitialLoadOnProjectPageAndOnline =
      isPageReload.current && isProjectPage && isOnlineAndReady

    const isNotInitialLoadOnProjectPageAndOnline =
      !isPageReload.current && isProjectPage && isOnlineAndReady

    if (isOfflineAndReadyAndAlreadyInitiated || isUserDeniedProjectAccessPage) {
      setIsOfflineStorageHydrated(true)
      setIsSyncInProgress(false)
    }

    if (isInitialLoadOnProjectPageAndOnline) {
      setIsSyncInProgress(true)
      resetSyncErrors()
      syncApiDataIntoOfflineStorage
        .pushThenPullAllProjectData(projectId)
        .then(() => {
          if (isMounted.current) {
            setIsOfflineStorageHydrated(true)
            setIsSyncInProgress(false)
            isPageReload.current = false
          }
        })
        .catch((error) => {
          setIsSyncInProgress(false)
          appendSyncError(language.error.apiDataSync)
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.apiDataSync))
            },
          })
        })
    }
    if (isNotInitialLoadOnProjectPageAndOnline) {
      // this captures when a user returns to being online after being offline
      setIsSyncInProgress(true)
      resetSyncErrors()
      syncApiDataIntoOfflineStorage
        .pushThenPullAllProjectDataExceptChoices(projectId)
        .then(() => {
          if (isMounted.current) {
            setIsSyncInProgress(false)
          }
        })
        .catch((error) => {
          setIsSyncInProgress(false)
          appendSyncError(language.error.apiDataSync)
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.apiDataSync))
            },
          })
        })
    }
  }, [
    handleHttpResponseError,
    isMounted,
    isOfflineAndReadyAndAlreadyInitiated,
    isOnlineAndReady,
    isProjectPage,
    isUserDeniedProjectAccessPage,
    projectId,
    setIsOfflineStorageHydrated,
    setIsSyncInProgress,
    setSyncErrors,
    syncApiDataIntoOfflineStorage,
  ])
}
