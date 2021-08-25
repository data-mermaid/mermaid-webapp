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

    const isInitialLoadOrReloadOnProjectsListPage =
      isProjectsListPage && isOnlineAndReady

    const isInitialLoadOnProjectPage =
      isPageReload.current && isProjectPage && isOnlineAndReady
    const isNotInitialLoadOnProjectPage =
      !isPageReload.current && isProjectPage && isOnlineAndReady

    if (isOfflineAndReadyAndAlreadyInitiated) {
      setIsOfflineStorageHydrated(true)
      setIsSyncInProgress(false)
    }

    if (isInitialLoadOrReloadOnProjectsListPage) {
      setIsSyncInProgress(true)
      syncApiDataIntoOfflineStorage
        .pullEverythingButProjectRelated()
        .then(() => {
          if (isMounted.current) {
            setIsOfflineStorageHydrated(true)
            setIsSyncInProgress(false)
            isPageReload.current = false
          }
        })
        .catch(() => {
          toast.error(language.error.apiDataPull)
        })
    }

    if (isInitialLoadOnProjectPage) {
      setIsSyncInProgress(true)
      syncApiDataIntoOfflineStorage
        .pullEverything(projectId)
        .then(() => {
          if (isMounted.current) {
            setIsOfflineStorageHydrated(true)
            setIsSyncInProgress(false)
            isPageReload.current = false
          }
        })
        .catch(() => {
          toast.error(language.error.apiDataPull)
        })
    }
    if (isNotInitialLoadOnProjectPage) {
      setIsSyncInProgress(true)
      syncApiDataIntoOfflineStorage
        .pullEverythingButChoices(projectId)
        .then(() => {
          if (isMounted.current) {
            setIsSyncInProgress(false)
          }
        })
        .catch(() => {
          toast.error(language.error.apiDataPull)
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
