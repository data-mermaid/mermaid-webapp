import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import language from '../../../language'
import { getProjectIdFromLocation } from '../../../library/getProjectIdFromLocation'
import { getToastArguments } from '../../../library/getToastArguments'
import { useSyncStatus } from './SyncStatusContext'

export const useInitializeSyncApiDataIntoOfflineStorage = ({
  apiBaseUrl,
  getAccessToken,
  dexiePerUserDataInstance,
  isMounted,
  isAppOnline,
  handleHttpResponseError,
  syncApiDataIntoOfflineStorage,
}) => {
  const location = useLocation()
  const isPageReload = useRef(true)

  const { setIsSyncInProgress, setIsOfflineStorageHydrated, setSyncErrors } = useSyncStatus()

  const _conditionallySyncOfflineStorageWithApiData = useEffect(() => {
    const resetSyncErrors = () => {
      setSyncErrors([])
    }
    const appendSyncError = (newError) => {
      setSyncErrors((previousState) => [...previousState, newError])
    }

    const isOnlineAndReady =
      apiBaseUrl && dexiePerUserDataInstance && isMounted.current && isAppOnline

    const projectId = getProjectIdFromLocation(location)

    const isProjectPage = !!projectId

    const isOfflineAndReadyAndAlreadyInitiated =
      apiBaseUrl && dexiePerUserDataInstance && isMounted.current && !isAppOnline

    const isProjectsListPage =
      location.pathname === '/projects' || location.pathname === '/projects/'

    const isProjectsListPageAndOnline = isProjectsListPage && isOnlineAndReady

    const isInitialLoadOnProjectPageAndOnline =
      isPageReload.current && isProjectPage && isOnlineAndReady
    const isNotInitialLoadOnProjectPageAndOnline =
      !isPageReload.current && isProjectPage && isOnlineAndReady

    if (isOfflineAndReadyAndAlreadyInitiated) {
      setIsOfflineStorageHydrated(true)
      setIsSyncInProgress(false)
    }

    if (isProjectsListPageAndOnline) {
      // this captures when a user returns to being online after being offline
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
    apiBaseUrl,
    dexiePerUserDataInstance,
    getAccessToken,
    isAppOnline,
    isMounted,
    handleHttpResponseError,
    location,
    setIsOfflineStorageHydrated,
    setIsSyncInProgress,
    setSyncErrors,
    syncApiDataIntoOfflineStorage,
  ])
}
