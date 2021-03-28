import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React, { useMemo } from 'react'

import { CustomToastContainer } from '../components/generic/toast'
import { mermaidDbAccessInstancePropTypes } from './mermaidData/mermaidDbAccessInstance'
import { useCurrentUser } from './mermaidData/useCurrentUser'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useRoutes } from './useRoutes'
import Footer from '../components/Footer'
import GlobalStyle from '../library/styling/globalStyles'
import Header from '../components/Header'
import Layout from '../components/generic/Layout'
import MermaidDatabaseGateway from './mermaidData/MermaidDatabaseGateway'
import theme from '../theme'
import useAuthentication from './useAuthentication'

function App({ mermaidDbAccessInstance }) {
  const { isOnline } = useOnlineStatus()
  const {
    auth0Token,
    isMermaidAuthenticated,
    logoutMermaid,
  } = useAuthentication()
  const mermaidDatabaseGatewayInstance = useMemo(() => {
    const apiBaseUrl = process.env.REACT_APP_MERMAID_API
    const areDependenciesReady =
      isMermaidAuthenticated && !!mermaidDbAccessInstance && apiBaseUrl

    return !areDependenciesReady
      ? undefined
      : new MermaidDatabaseGateway({
          apiBaseUrl,
          auth0Token,
          isMermaidAuthenticated,
          isOnline,
          mermaidDbAccessInstance,
        })
  }, [auth0Token, isMermaidAuthenticated, isOnline, mermaidDbAccessInstance])

  const currentUser = useCurrentUser({
    mermaidDatabaseGatewayInstance,
  })
  const { routes } = useRoutes({ mermaidDatabaseGatewayInstance })

  const layoutProps = {
    header: <Header currentUser={currentUser} logout={logoutMermaid} />,
    footer: <Footer />,
  }

  const isMermaidAuthenticatedAndReady =
    isMermaidAuthenticated && currentUser && mermaidDatabaseGatewayInstance

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
  mermaidDbAccessInstance: mermaidDbAccessInstancePropTypes.isRequired,
}

export default App
