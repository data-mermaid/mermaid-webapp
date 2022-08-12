import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React, { useCallback, useMemo } from 'react'

import { CurrentUserProvider } from './CurrentUserContext'
import { BellNotificationProvider } from './BellNotificationContext'
import { HttpResponseErrorHandlerProvider } from './HttpResponseErrorHandlerContext'
import { CustomToastContainer } from '../components/generic/toast'
import { DatabaseSwitchboardInstanceProvider } from './mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useInitializeBellNotifications } from './useInitializeBellNotifications'
import { useInitializeCurrentUser } from './useInitializeCurrentUser'
import { useInitializeSyncApiDataIntoOfflineStorage } from './mermaidData/syncApiDataIntoOfflineStorage/useInitializeSyncApiDataIntoOfflineStorage'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useRoutes } from './useRoutes'
import { useSyncStatus } from './mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import DatabaseSwitchboard from './mermaidData/databaseSwitchboard'
import dexieInstancePropTypes from './dexieInstancePropTypes'
import Footer from '../components/Footer'
import GlobalStyle from '../library/styling/globalStyles'
import Header from '../components/Header'
import Layout from '../components/Layout'
import LoadingIndicator from '../components/LoadingIndicator/LoadingIndicator'
import PageNotFound from '../components/pages/PageNotFound'
import SyncApiDataIntoOfflineStorage from './mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import theme from '../theme'
import useAuthentication from './useAuthentication'
import useIsMounted from '../library/useIsMounted'
import { useDexiePerUserDataInstance } from './dexiePerUserDataInstanceContext'
import handleHttpResponseError from '../library/handleHttpResponseError'

function App({ dexieCurrentUserInstance }) {
  const { isAppOnline } = useOnlineStatus()
  const apiBaseUrl = process.env.REACT_APP_MERMAID_API
  const isMounted = useIsMounted()

  const { getAccessToken, isMermaidAuthenticated, logoutMermaid } = useAuthentication({
    dexieCurrentUserInstance,
  })

  const handleHttpResponseErrorWithLogoutFunction = useCallback(
    (error, callback) => handleHttpResponseError({ error, callback, logoutMermaid }),
    [logoutMermaid],
  )

  const { currentUser, saveUserProfile } = useInitializeCurrentUser({
    apiBaseUrl,
    getAccessToken,
    dexieCurrentUserInstance,
    isMermaidAuthenticated,
    isAppOnline,
  })

  const { dexiePerUserDataInstance } = useDexiePerUserDataInstance({
    currentUser,
  })

  useInitializeSyncApiDataIntoOfflineStorage({
    apiBaseUrl,
    getAccessToken,
    dexiePerUserDataInstance,
    isMounted,
    isAppOnline,
    logoutMermaid,
  })

  const { isOfflineStorageHydrated, syncErrors } = useSyncStatus()

  const apiSyncInstance = useMemo(() => {
    return new SyncApiDataIntoOfflineStorage({
      dexiePerUserDataInstance,
      apiBaseUrl,
      getAccessToken,
    })
  }, [dexiePerUserDataInstance, apiBaseUrl, getAccessToken])

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
  })

  const layoutProps = {
    header: <Header currentUser={currentUser} logout={logoutMermaid} />,
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
              <Layout {...layoutProps}>
                {
                  /** The isMermaidAuthenticated is needed here to prevent an
                   * infinite log in loop with authentication.
                   *
                   * The projects list route and project workflow pages will trigger
                   * a sync when they are routed to, making isOfflineStorageHydrated = true
                   */
                  isMermaidAuthenticated ? (
                    <Switch>
                      {routes.map(({ path, Component }) => (
                        <Route
                          exact
                          path={path}
                          key={path}
                          render={() =>
                            isMermaidAuthenticatedAndReady ? <Component /> : <LoadingIndicator />
                          }
                        />
                      ))}
                      <Route exact path="/">
                        <Redirect to="/projects" />
                      </Route>
                      <Route component={PageNotFound} />
                    </Switch>
                  ) : (
                    <LoadingIndicator />
                  )
                }
              </Layout>
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
