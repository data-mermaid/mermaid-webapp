import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import { toast } from 'react-toastify'
import React, { useCallback, useMemo } from 'react'

import { BellNotificationProvider } from './BellNotificationContext'
import { CurrentUserProvider } from './CurrentUserContext'
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
import { useRoutes } from './useRoutes'
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

function App({ dexieCurrentUserInstance }) {
  const { isAppOnline } = useOnlineStatus()
  const { isOfflineStorageHydrated, syncErrors, isSyncInProgress } = useSyncStatus()
  const apiBaseUrl = process.env.REACT_APP_MERMAID_API
  const history = useHistory()
  const isMounted = useIsMounted()
  const location = useLocation()

  const { getAccessToken, isMermaidAuthenticated, logoutMermaid } = useAuthentication({
    dexieCurrentUserInstance,
  })

  const handleHttpResponseErrorWithLogoutFunction = useCallback(
    ({ error, callback }) => handleHttpResponseError({ error, callback, logoutMermaid }),
    [logoutMermaid],
  )

  const handleNested500SyncError = () => {
    toast.error(...getToastArguments(language.error.pushSyncErrorMessageStatusCode500))
  }

  const handleUserDeniedSyncPull = useCallback(
    (projectName) => {
      history.push(projectName ? `/noProjectAccess/${projectName}` : '/noProjectAccess')
    },
    [history],
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

  const { currentUser, saveUserProfile } = useInitializeCurrentUser({
    apiBaseUrl,
    getAccessToken,
    dexieCurrentUserInstance,
    isMermaidAuthenticated,
    isAppOnline,
    isSyncInProgress,
    handleHttpResponseErrorWithLogoutFunction,
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
    getAccessToken,
    dexiePerUserDataInstance,
    isMounted,
    isAppOnline,
    handleHttpResponseError: handleHttpResponseErrorWithLogoutFunction,
    syncApiDataIntoOfflineStorage: apiSyncInstance,
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

  const { routes } = useRoutes({ apiSyncInstance })

  const { notifications, deleteNotification } = useInitializeBellNotifications({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated,
    isAppOnline,
    handleHttpResponseErrorWithLogoutFunction,
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
    currentUser &&
    databaseSwitchboardInstance &&
    (isOfflineStorageHydrated || syncErrors.length) // we use isOfflineStrorageHydrated here instead of isSyncInProgress to make sure the app level layout doesnt rerender (flash) on sync

  return (
    <ThemeProvider theme={theme}>
      <DatabaseSwitchboardInstanceProvider value={databaseSwitchboardInstance}>
        <CurrentUserProvider value={{ currentUser, saveUserProfile }}>
          <HttpResponseErrorHandlerProvider value={handleHttpResponseErrorWithLogoutFunction}>
            <BellNotificationProvider value={{ notifications, deleteNotification }}>
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
                        <Switch>
                          {routes.map(({ path, Component }) => (
                            <Route
                              exact
                              path={path}
                              key={path}
                              render={() =>
                                isMermaidAuthenticatedAndReady ? (
                                  <Component />
                                ) : (
                                  <LoadingIndicator />
                                )
                              }
                            />
                          ))}
                          <Route exact path="/">
                            <Redirect to="/projects" />
                          </Route>
                          {/* The following route is required b/c of how Cloudfront handles root paths. This is
                            required for preview urls. When viewing a preview, you will need to append /index.html
                            like so: https://preview.app2.datamermaid.org/123/index.html */}
                          <Route exact path="/index.html">
                            <Redirect to="/projects" />
                          </Route>
                          <Route component={PageNotFound} />
                        </Switch>
                      </ErrorBoundary>
                    ) : (
                      <LoadingIndicator />
                    )
                  }
                </Layout>
              </ErrorBoundary>
            </BellNotificationProvider>
          </HttpResponseErrorHandlerProvider>
        </CurrentUserProvider>
      </DatabaseSwitchboardInstanceProvider>
    </ThemeProvider>
  )
}

App.propTypes = {
  dexieCurrentUserInstance: dexieInstancePropTypes.isRequired,
}

export default App
