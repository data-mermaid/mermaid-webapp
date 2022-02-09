import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import language from '../../../language'
import SyncApiDataIntoOfflineStorage from './SyncApiDataIntoOfflineStorage'
import { useSyncStatus } from './SyncStatusContext'

const getProjectIdFromLocation = location => {
  const { pathname } = location

  const pathNameParts = pathname.split('/')

  const projectId = pathNameParts[pathNameParts.indexOf('projects') + 1]

  return projectId
}

export const useInitializeSyncApiDataIntoOfflineStorage = ({
  apiBaseUrl,
  getAccessToken,
  dexieInstance,
  isMounted,
  isAppOnline,
}) => {
  const location = useLocation()
  const isPageReload = useRef(true)

  const syncApiDataIntoOfflineStorage = useMemo(
    () =>
      new SyncApiDataIntoOfflineStorage({
        dexieInstance,
        apiBaseUrl,
        getAccessToken,
      }),
    [dexieInstance, apiBaseUrl, getAccessToken],
  )
  const { setIsSyncInProgress, setIsOfflineStorageHydrated, setSyncErrors } = useSyncStatus()

  const _conditionallySyncOfflineStorageWithApiData = useEffect(() => {
    const resetSyncErrors = () => {
      setSyncErrors([])
    }
    const appendSyncError = newError => {
      setSyncErrors(previousState => [...previousState, newError])
    }

    const isOnlineAndReady =
      apiBaseUrl && dexieInstance && isMounted.current && isAppOnline

    const projectId = getProjectIdFromLocation(location)

    const isProjectPage = !!projectId

    const isOfflineAndReadyAndAlreadyInitiated =
      apiBaseUrl && dexieInstance && isMounted.current && !isAppOnline

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
        .catch(() => {
          setIsSyncInProgress(false)
          appendSyncError(language.error.apiDataSync)
          toast.error(language.error.apiDataSync)
        })
    }

    if (isInitialLoadOnProjectPageAndOnline) {
      setIsSyncInProgress(true)
      resetSyncErrors()
      syncApiDataIntoOfflineStorage
        .pushThenPullEverythingForAProject(projectId)
        .then(() => {
          if (isMounted.current) {
            setIsOfflineStorageHydrated(true)
            setIsSyncInProgress(false)
            isPageReload.current = false
          }
        })
        .catch(() => {
          setIsSyncInProgress(false)
          appendSyncError(language.error.apiDataSync)
          toast.error(language.error.apiDataSync)
        })
    }
    if (isNotInitialLoadOnProjectPageAndOnline) {
      // this captures when a user returns to being online after being offline
      setIsSyncInProgress(true)
      resetSyncErrors()
      syncApiDataIntoOfflineStorage
        .pushThenPullEverythingForAProjectButChoices(projectId)
        .then(() => {
          if (isMounted.current) {
            setIsSyncInProgress(false)
          }
        })
        .catch(() => {
          setIsSyncInProgress(false)
          appendSyncError(language.error.apiDataSync)
          toast.error(language.error.apiDataSync)
        })
    }
  }, [
    apiBaseUrl,
    getAccessToken,
    dexieInstance,
    isAppOnline,
    isMounted,
    location,
    setIsOfflineStorageHydrated,
    setIsSyncInProgress,
    setSyncErrors,
    syncApiDataIntoOfflineStorage,
  ])
}
