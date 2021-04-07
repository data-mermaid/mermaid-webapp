import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React, { useMemo } from 'react'

import { CustomToastContainer } from '../components/generic/toast'
import { dexieInstancePropTypes } from './mermaidData/dexieInstance'
import { useCurrentUser } from './mermaidData/useCurrentUser'
import { useOnlineStatus } from '../library/onlineStatusContext'
import { useRoutes } from './useRoutes'
import DatabaseSwitchboard from './mermaidData/databaseSwitchboard'
import GlobalStyle from '../library/styling/globalStyles'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageNotFound from '../components/pages/PageNotFound'

import theme from '../theme'
import useAuthentication from './useAuthentication'
import Layout from '../components/Layout'

function App({ dexieInstance }) {
  const { isOnline } = useOnlineStatus()
  const {
    auth0Token,
    isMermaidAuthenticated,
    logoutMermaid,
  } = useAuthentication()
  const databaseSwitchboardInstance = useMemo(() => {
    const apiBaseUrl = process.env.REACT_APP_MERMAID_API
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
        })
  }, [auth0Token, isMermaidAuthenticated, isOnline, dexieInstance])

  const currentUser = useCurrentUser({
    databaseSwitchboardInstance,
  })
  const { routes } = useRoutes({ databaseSwitchboardInstance })

  const layoutProps = {
    header: <Header currentUser={currentUser} logout={logoutMermaid} />,
    footer: <Footer />,
  }

  const isMermaidAuthenticatedAndReady =
    isMermaidAuthenticated && currentUser && databaseSwitchboardInstance

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
          <Route render={() => <PageNotFound />} />
        </Switch>
      )}
    </ThemeProvider>
  )
}

App.propTypes = {
  dexieInstance: dexieInstancePropTypes.isRequired,
}

export default App
