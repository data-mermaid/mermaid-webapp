import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { CustomToastContainer } from '../components/generic/toast'
import { DatabaseSwitchboardInstanceProvider } from './mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { dexieInstancePropTypes } from './mermaidData/dexieInstance'
import { initiallyHydrateOfflineStorageWithApiData } from './initiallyHydrateOfflineStorageWithApiData'
import { useCurrentUser } from './mermaidData/useCurrentUser'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useRoutes } from './useRoutes'
import ApiSync from './mermaidData/ApiSync/ApiSync'
import DatabaseSwitchboard from './mermaidData/databaseSwitchboard'
import Footer from '../components/Footer'
import GlobalStyle from '../library/styling/globalStyles'
import Header from '../components/Header'
import language from '../language'
import Layout from '../components/Layout'
import PageNotFound from '../components/pages/PageNotFound'
import theme from '../theme'
import useAuthentication from './useAuthentication'
import useIsMounted from '../library/useIsMounted'

function App({ dexieInstance }) {
  const isMounted = useIsMounted()
  const { isOnline } = useOnlineStatus()
  const {
    auth0Token,
    isMermaidAuthenticated,
    logoutMermaid,
  } = useAuthentication({ dexieInstance })
  const apiBaseUrl = process.env.REACT_APP_MERMAID_API
  const [isOfflineStorageHydrated, setIsOfflineStorageHydrated] = useState(true)

  const _initiallyHydrateOfflineStorageWithApiData = useEffect(() => {
    if (dexieInstance && isMounted.current && isOnline) {
      initiallyHydrateOfflineStorageWithApiData(dexieInstance)
        .then(setIsOfflineStorageHydrated(true))
        .catch(() => toast.error(language.error.initialApiDataPull))
    }
  }, [dexieInstance, isMounted, isOnline])
  const { current: apiSyncInstance } = useRef(
    new ApiSync({
      dexieInstance,
      apiBaseUrl,
      auth0Token,
    }),
  )

  const databaseSwitchboardInstance = useMemo(() => {
    const areDependenciesReady =
      isMermaidAuthenticated && !!dexieInstance && apiBaseUrl

    return !areDependenciesReady
      ? undefined
      : new DatabaseSwitchboard({
          apiBaseUrl,
          auth0Token,
          isMermaidAuthenticated,
          isOnline,
          dexieInstance,
          apiSyncInstance,
        })
  }, [
    auth0Token,
    isMermaidAuthenticated,
    isOnline,
    dexieInstance,
    apiBaseUrl,
    apiSyncInstance,
  ])

  const currentUser = useCurrentUser({
    databaseSwitchboardInstance,
  })
  const { routes } = useRoutes({ currentUser })

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
        {isMermaidAuthenticatedAndReady && (
          <Switch>
            {routes.map(({ path, Component }) => (
              <Route
                exact
                path={path}
                key={path}
                render={() => (
                  <Layout {...layoutProps}>
                    <Component />
                  </Layout>
                )}
              />
            ))}
            <Route exact path="/">
              <Redirect to="/projects" />
            </Route>
            <Route component={PageNotFound} />
          </Switch>
        )}
      </DatabaseSwitchboardInstanceProvider>
    </ThemeProvider>
  )
}

App.propTypes = {
  dexieInstance: dexieInstancePropTypes.isRequired,
}

export default App
