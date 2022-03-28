import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React, { useMemo } from 'react'

import { CustomToastContainer } from '../components/generic/toast'
import { DatabaseSwitchboardInstanceProvider } from './mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { dexieInstancePropTypes } from './mermaidData/dexieInstance'
import { useInitializeCurrentUser } from './useInitializeCurrentUser'
import { useInitializeSyncApiDataIntoOfflineStorage } from './mermaidData/syncApiDataIntoOfflineStorage/useInitializeSyncApiDataIntoOfflineStorage'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useRoutes } from './useRoutes'
import { useSyncStatus } from './mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import DatabaseSwitchboard from './mermaidData/databaseSwitchboard'
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

function App({ dexieInstance }) {
  const isMounted = useIsMounted()
  const { isAppOnline } = useOnlineStatus()
  const { getAccessToken, isMermaidAuthenticated, logoutMermaid } = useAuthentication({
    dexieInstance,
  })
  const apiBaseUrl = process.env.REACT_APP_MERMAID_API

  useInitializeSyncApiDataIntoOfflineStorage({
    apiBaseUrl,
    getAccessToken,
    dexieInstance,
    isMounted,
    isAppOnline,
  })

  const { isOfflineStorageHydrated, syncErrors } = useSyncStatus()

  const apiSyncInstance = useMemo(() => {
    return new SyncApiDataIntoOfflineStorage({
      dexieInstance,
      apiBaseUrl,
      getAccessToken,
    })
  }, [dexieInstance, apiBaseUrl, getAccessToken])

  const databaseSwitchboardInstance = useMemo(() => {
    const areDependenciesReady = !!dexieInstance && apiBaseUrl && isMermaidAuthenticated

    return !areDependenciesReady
      ? undefined
      : new DatabaseSwitchboard({
          apiBaseUrl,
          apiSyncInstance,
          getAccessToken,
          dexieInstance,
          isMermaidAuthenticated,
          isAppOnline,
        })
  }, [
    getAccessToken,
    isMermaidAuthenticated,
    isAppOnline,
    dexieInstance,
    apiBaseUrl,
    apiSyncInstance,
  ])

  const currentUser = useInitializeCurrentUser({
    apiBaseUrl,
    getAccessToken,
    dexieInstance,
    isMermaidAuthenticated,
    isAppOnline,
  })
  const { routes } = useRoutes({ currentUser, apiSyncInstance })

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
      </DatabaseSwitchboardInstanceProvider>
    </ThemeProvider>
  )
}

App.propTypes = {
  dexieInstance: dexieInstancePropTypes.isRequired,
}

export default App
