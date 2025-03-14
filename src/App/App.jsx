import { Route, useLocation, Routes, Navigate, useNavigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { toast } from 'react-toastify'
import React, { useCallback, useMemo } from 'react'

import { BellNotificationProvider } from './BellNotificationContext'
import { CurrentUserProvider } from './CurrentUserContext'
import { CurrentProjectProvider } from './CurrentProjectContext'
import { CustomToastContainer } from '../components/generic/toast'
import { DatabaseSwitchboardInstanceProvider } from './mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { getToastArguments } from '../library/getToastArguments'
import { HttpResponseErrorHandlerProvider } from './HttpResponseErrorHandlerContext'
import { P } from '../components/generic/text'
import { useDexiePerUserDataInstance } from './dexiePerUserDataInstanceContext'
import { useInitializeBellNotifications } from './useInitializeBellNotifications'
import { useInitializeCurrentUser } from './useInitializeCurrentUser'
import { useInitializeSyncApiDataIntoOfflineStorage } from './mermaidData/syncApiDataIntoOfflineStorage/useInitializeSyncApiDataIntoOfflineStorage'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useSyncStatus } from './mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import DatabaseSwitchboard from './mermaidData/databaseSwitchboard'
import dexieInstancePropTypes from './dexieInstancePropTypes'
import ErrorBoundary from '../components/ErrorBoundary'
import Footer from '../components/Footer'
import GlobalStyle from '../library/styling/globalStyles'
import handleHttpResponseError from '../library/handleHttpResponseError'
import Header from '../components/Header'
import language from '../language'
import Layout from '../components/Layout'
import LoadingIndicator from '../components/LoadingIndicator/LoadingIndicator'
import PageNotFound from '../components/pages/PageNotFound'
import SyncApiDataIntoOfflineStorage from './mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import theme from '../theme'
import useAuthentication from './useAuthentication'
import useIsMounted from '../library/useIsMounted'
import { getProjectIdFromLocation } from '../library/getProjectIdFromLocation'
import { routes } from './routes'

function App({ dexieCurrentUserInstance }) {
  // trigger pr deploy cause it didnt work last time
  const { isAppOnline, setServerNotReachable } = useOnlineStatus()
  const { isOfflineStorageHydrated, syncErrors } = useSyncStatus()
  const apiBaseUrl = import.meta.env.VITE_MERMAID_API
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const location = useLocation()

  const { getAccessToken, isMermaidAuthenticated, logoutMermaid } = useAuthentication({
    dexieCurrentUserInstance,
  })

  const handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied = useCallback(
    ({ error, callback, shouldShowServerNonResponseMessage }) =>
      handleHttpResponseError({
        error,
        callback,
        logoutMermaid,
        shouldShowServerNonResponseMessage,
        setServerNotReachable,
      }),
    [logoutMermaid, setServerNotReachable],
  )

  const handleNested500SyncError = () => {
    toast.error(...getToastArguments(language.error.pushSyncErrorMessageStatusCode500))
  }

  const handleUserDeniedSyncPull = useCallback(
    (projectName) => {
      navigate(projectName ? `/noProjectAccess/${projectName}` : '/noProjectAccess')
    },
    [navigate],
  )

  const handleUserDeniedSyncPush = useCallback(
    (projectsWithSyncErrors) => {
      // projectsWithSyncErrors's type: { projectId: { name: string, apiDataTablesThatRejectedSyncing: string[] } }
      Object.entries(projectsWithSyncErrors).forEach((projectWithSyncErrorsEntry) => {
        const projectId = projectWithSyncErrorsEntry[0]
        const { name: projectName, apiDataTablesThatRejectedSyncing } =
          projectWithSyncErrorsEntry[1]

        const currentPagesProjectId = getProjectIdFromLocation(location)
        const isErrorSpecificToProject = currentPagesProjectId === projectId

        if (isErrorSpecificToProject) {
          const syncErrorUserMessaging = (
            <div data-testid={`sync-error-for-project-${projectId}`}>
              <P>{language.error.getPushSyncErrorMessage(projectName)}</P>
              {language.error.pushSyncErrorMessageUnsavedData}
              <ul>
                {apiDataTablesThatRejectedSyncing?.map((rejectedDataTableName) => (
                  <li key={rejectedDataTableName}>
                    {language.apiDataTableNames[rejectedDataTableName]}
                  </li>
                ))}
              </ul>
            </div>
          )

          toast.error(...getToastArguments(syncErrorUserMessaging))
        }
      })
    },
    [location],
  )

  const { currentUser, saveUserProfile, refreshCurrentUser } = useInitializeCurrentUser({
    apiBaseUrl,
    getAccessToken,
    dexieCurrentUserInstance,
    isMermaidAuthenticated,
    isAppOnline,
    handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied,
  })

  const { dexiePerUserDataInstance } = useDexiePerUserDataInstance({
    currentUser,
  })

  const apiSyncInstance = useMemo(() => {
    if (dexiePerUserDataInstance && apiBaseUrl && getAccessToken && handleUserDeniedSyncPush) {
      return new SyncApiDataIntoOfflineStorage({
        dexiePerUserDataInstance,
        apiBaseUrl,
        getAccessToken,
        handleUserDeniedSyncPull,
        handleUserDeniedSyncPush,
        handleNested500SyncError,
      })
    }

    return undefined
  }, [
    apiBaseUrl,
    dexiePerUserDataInstance,
    getAccessToken,
    handleUserDeniedSyncPull,
    handleUserDeniedSyncPush,
  ])

  useInitializeSyncApiDataIntoOfflineStorage({
    apiBaseUrl,
    dexiePerUserDataInstance,
    isMounted,
    isAppOnline,
    handleHttpResponseError: handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied,
    syncApiDataIntoOfflineStorage: apiSyncInstance,
    refreshCurrentUser,
  })

  const databaseSwitchboardInstance = useMemo(() => {
    const areDependenciesReady = !!dexiePerUserDataInstance && apiBaseUrl && isMermaidAuthenticated

    return !areDependenciesReady
      ? undefined
      : new DatabaseSwitchboard({
          apiBaseUrl,
          apiSyncInstance,
          getAccessToken,
          dexiePerUserDataInstance,
          isMermaidAuthenticated,
          isAppOnline,
        })
  }, [
    getAccessToken,
    isMermaidAuthenticated,
    isAppOnline,
    dexiePerUserDataInstance,
    apiBaseUrl,
    apiSyncInstance,
  ])

  const { notifications, deleteNotification, deleteAllNotifications } =
    useInitializeBellNotifications({
      apiBaseUrl,
      getAccessToken,
      isMermaidAuthenticated,
      isAppOnline,
      handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied,
    })

  const deleteMermaidData = () => {
    dexiePerUserDataInstance.delete()
    dexieCurrentUserInstance.delete()
  }

  const logoutAndClearMermaidData = () => {
    // We delete all of the user's data on logout to aid in troubleshooting.
    // When a user is having issues, its easier to tell them to logout and log back in than to tell them to clear their site data
    deleteMermaidData()
    logoutMermaid()
  }

  const layoutProps = {
    header: <Header currentUser={currentUser} logout={logoutAndClearMermaidData} />,
    footer: <Footer />,
  }

  const isMermaidAuthenticatedAndReady =
    isMermaidAuthenticated &&
    !!currentUser &&
    !!databaseSwitchboardInstance &&
    (isOfflineStorageHydrated || !!syncErrors.length) // we use isOfflineStrorageHydrated here instead of isSyncInProgress to make sure the app level layout doesnt rerender (flash) on sync

  return (
    <ThemeProvider theme={theme}>
      <DatabaseSwitchboardInstanceProvider value={databaseSwitchboardInstance}>
        <CurrentUserProvider value={{ currentUser, saveUserProfile, refreshCurrentUser }}>
          <CurrentProjectProvider>
            <HttpResponseErrorHandlerProvider
              value={handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied}
            >
              <BellNotificationProvider
                value={{ notifications, deleteNotification, deleteAllNotifications }}
              >
                <GlobalStyle />
                <CustomToastContainer limit={5} />
                <ErrorBoundary>
                  <Layout {...layoutProps}>
                    {
                      /** The isMermaidAuthenticated is needed here to prevent an
                       * infinite log in loop with authentication.
                       *
                       * The projects list route and project workflow pages will trigger
                       * a sync when they are routed to, making isOfflineStorageHydrated = true
                       */
                      isMermaidAuthenticated ? (
                        <ErrorBoundary>
                          <Routes>
                            {routes.map(({ path, Component }) => (
                              <Route
                                exact
                                path={path}
                                key={path}
                                element={
                                  isMermaidAuthenticatedAndReady ? (
                                    <Component />
                                  ) : (
                                    <LoadingIndicator />
                                  )
                                }
                              />
                            ))}
                            <Route exact path="/" element={<Navigate to="/projects" replace />} />

                            {/* The following route is required b/c of how Cloudfront handles root paths. This is
                              required for preview urls. When viewing a preview, you will need to append /index.html
                              like so: https://preview.app2.datamermaid.org/123/index.html */}
                            <Route exact path="/index.html" element={<Navigate to="/projects" />} />
                            <Route path="/*" element={<PageNotFound />} />
                          </Routes>
                        </ErrorBoundary>
                      ) : (
                        <LoadingIndicator />
                      )
                    }
                  </Layout>
                </ErrorBoundary>
              </BellNotificationProvider>
            </HttpResponseErrorHandlerProvider>
          </CurrentProjectProvider>
        </CurrentUserProvider>
      </DatabaseSwitchboardInstanceProvider>
    </ThemeProvider>
  )
}

App.propTypes = {
  dexieCurrentUserInstance: dexieInstancePropTypes.isRequired,
}

export default App
