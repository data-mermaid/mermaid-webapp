import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React from 'react'

import Breadcrumbs from '../components/generic/Breadcrumbs'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/generic/Layout'
import theme from '../theme'
import useAuthentication from '../library/useAuthentication'
import { useRoutes } from '../library/useRoutes'
import {
  mermaidApiServicePropType,
  useMermaidApi,
} from '../ApiServices/useMermaidApi'
import useOnlineStatus from '../library/useOnlineStatus'

function App({ mermaidDbAccessInstance }) {
  const { isOnline } = useOnlineStatus()
  const {
    isMermaidAuthenticated,
    logoutMermaid,
    authenticatedAxios,
  } = useAuthentication({
    isOnline,
  })
  const apiService = useMermaidApi({
    authenticatedAxios,
    isMermaidAuthenticated,
    isOnline,
    mermaidDbAccessInstance,
  })
  const { routes, getBreadCrumbs } = useRoutes(apiService)

  const layoutProps = {
    header: (
      <Header
        currentUser={apiService.currentUser}
        isOnline={isOnline}
        logout={logoutMermaid}
      />
    ),
    footer: <Footer />,
  }

  const isMermaidAuthenticatedAndReady =
    isMermaidAuthenticated && apiService.currentUser

  return (
    <ThemeProvider theme={theme}>
      {isMermaidAuthenticatedAndReady && (
        <Switch>
          {routes.map(({ path, Component }) => (
            <Route
              exact
              path={path}
              key={path}
              render={(routeProps) => (
                <Layout
                  {...layoutProps}
                  breadcrumbs={
                    <Breadcrumbs crumbs={getBreadCrumbs(routeProps)} />
                  }
                >
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
  mermaidDbAccessInstance: mermaidApiServicePropType.isRequired,
}

export default App
