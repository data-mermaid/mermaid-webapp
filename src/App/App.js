import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React, { useMemo } from 'react'

import { CustomToastContainer } from '../components/generic/toast'
import { dexieInstancePropTypes } from '../library/mermaidData/dexieInstance'
import { useCurrentUser } from '../library/mermaidData/useCurrentUser'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useRoutes } from '../library/useRoutes'
import DatabaseGateway from '../library/mermaidData/DatabaseGateway'
import Footer from '../components/Footer'
import GlobalStyle from '../library/styling/globalStyles'
import Header from '../components/Header'
import Layout from '../components/generic/Layout'
import theme from '../theme'
import useAuthentication from '../library/useAuthentication'

function App({ dexieInstance }) {
  const { isOnline } = useOnlineStatus()
  const {
    auth0Token,
    isMermaidAuthenticated,
    logoutMermaid,
  } = useAuthentication({})
  const databaseGatewayInstance = useMemo(() => {
    const apiBaseUrl = process.env.REACT_APP_MERMAID_API
    const areDependenciesReady =
      isMermaidAuthenticated && !!dexieInstance && apiBaseUrl

    return !areDependenciesReady
      ? undefined
      : new DatabaseGateway({
          apiBaseUrl,
          auth0Token,
          isMermaidAuthenticated,
          isOnline,
          dexieInstance,
        })
  }, [auth0Token, isMermaidAuthenticated, isOnline, dexieInstance])

  const currentUser = useCurrentUser({
    databaseGatewayInstance,
  })
  const { routes } = useRoutes({ databaseGatewayInstance })

  const layoutProps = {
    header: <Header currentUser={currentUser} logout={logoutMermaid} />,
    footer: <Footer />,
  }

  const isMermaidAuthenticatedAndReady =
    isMermaidAuthenticated && currentUser && databaseGatewayInstance

  return (
    <ThemeProvider theme={theme}>
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
        </Switch>
      )}
    </ThemeProvider>
  )
}

App.propTypes = {
  dexieInstance: dexieInstancePropTypes.isRequired,
}

export default App
