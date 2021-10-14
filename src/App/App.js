import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React, { useMemo } from 'react'

import { CustomToastContainer } from '../components/generic/toast'
import { DatabaseSwitchboardInstanceProvider } from './mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { dexieInstancePropTypes } from './mermaidData/dexieInstance'
import { useCurrentUser } from './mermaidData/useCurrentUser'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useRoutes } from './useRoutes'
import { useInitializeSyncApiDataIntoOfflineStorage } from './mermaidData/syncApiDataIntoOfflineStorage/useInitializeSyncApiDataIntoOfflineStorage'
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
import { useSyncStatus } from './mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'

function App({ dexieInstance }) {
  const isMounted = useIsMounted()
  const { isAppOnline } = useOnlineStatus()
  const {
    auth0Token,
    isMermaidAuthenticated,
    logoutMermaid,
  } = useAuthentication({ dexieInstance })
  const apiBaseUrl = process.env.REACT_APP_MERMAID_API

  useInitializeSyncApiDataIntoOfflineStorage({
    apiBaseUrl,
    auth0Token,
    dexieInstance,
    isMounted,
    isAppOnline,
  })

  const { isOfflineStorageHydrated } = useSyncStatus()

  const apiSyncInstance = useMemo(() => {
    return new SyncApiDataIntoOfflineStorage({
      dexieInstance,
      apiBaseUrl,
      auth0Token,
    })
  }, [dexieInstance, apiBaseUrl, auth0Token])

  const databaseSwitchboardInstance = useMemo(() => {
    const areDependenciesReady =
      !!dexieInstance &&
      apiBaseUrl &&
      isMermaidAuthenticated &&
      isOfflineStorageHydrated

    return !areDependenciesReady
      ? undefined
      : new DatabaseSwitchboard({
          apiBaseUrl,
          apiSyncInstance,
          auth0Token,
          dexieInstance,
          isMermaidAuthenticated,
          isOfflineStorageHydrated,
          isAppOnline,
        })
  }, [
    auth0Token,
    isMermaidAuthenticated,
    isAppOnline,
    dexieInstance,
    apiBaseUrl,
    apiSyncInstance,
    isOfflineStorageHydrated,
  ])

  const currentUser = useCurrentUser({
    apiBaseUrl,
    auth0Token,
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
    isOfflineStorageHydrated

  return (
    <ThemeProvider theme={theme}>
      <DatabaseSwitchboardInstanceProvider value={databaseSwitchboardInstance}>
        <GlobalStyle />
        <CustomToastContainer />
        <Layout {...layoutProps}>
          {
            /** The isMermaidAuthenticated is needed here to prevent an
             * infinite log in loop with authentication.
             *
             * The projects list route and project workflow pages will trigger
             * a sync when they are routed to making isOfflineStorageHydrated = true,
             * which is needed for there to be a database switchboard instance,
             * which those pages depend on
             */

            isMermaidAuthenticated ? (
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
