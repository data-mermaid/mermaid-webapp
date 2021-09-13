import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import language from '../../../language'
import SyncApiDataIntoOfflineStorage from './SyncApiDataIntoOfflineStorage'
import { useSyncStatus } from './SyncStatusContext'

const getProjectIdFromLocation = (location) => {
  const { pathname } = location

  const pathNameParts = pathname.split('/')

  const projectId = pathNameParts[pathNameParts.indexOf('projects') + 1]

  return projectId
}

export const useSyncApiDataIntoOfflineStorage = ({
  apiBaseUrl,
  auth0Token,
  dexieInstance,
  isMounted,
  isOnline,
}) => {
  const location = useLocation()
  const [isOfflineStorageHydrated, setIsOfflineStorageHydrated] = useState(
    false,
  )
  const isPageReload = useRef(true)
  const syncApiDataIntoOfflineStorage = useMemo(
    () =>
      new SyncApiDataIntoOfflineStorage({
        dexieInstance,
        apiBaseUrl,
        auth0Token,
      }),
    [dexieInstance, apiBaseUrl, auth0Token],
  )
  const { setIsSyncInProgress } = useSyncStatus()

  const _conditionallySyncOfflineStorageWithApiData = useEffect(() => {
    const isOnlineAndReady =
      apiBaseUrl && auth0Token && dexieInstance && isMounted.current && isOnline

    const projectId = getProjectIdFromLocation(location)

    const isProjectPage = !!projectId

    const isOfflineAndReadyAndAlreadyInitiated =
      apiBaseUrl &&
      !auth0Token &&
      dexieInstance &&
      isMounted.current &&
      !isOnline

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
          toast.error(language.error.apiDataSync)
        })
    }

    if (isInitialLoadOnProjectPageAndOnline) {
      setIsSyncInProgress(true)
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
          toast.error(language.error.apiDataSync)
        })
    }
    if (isNotInitialLoadOnProjectPageAndOnline) {
      // this captures when a user returns to being online after being offline
      setIsSyncInProgress(true)
      syncApiDataIntoOfflineStorage
        .pushThenPullEverythingForAProjectButChoices(projectId)
        .then(() => {
          if (isMounted.current) {
            setIsSyncInProgress(false)
          }
        })
        .catch(() => {
          toast.error(language.error.apiDataSync)
        })
    }
  }, [
    apiBaseUrl,
    auth0Token,
    dexieInstance,
    isMounted,
    isOnline,
    location,
    setIsSyncInProgress,
    syncApiDataIntoOfflineStorage,
  ])

  return { isOfflineStorageHydrated }
}
