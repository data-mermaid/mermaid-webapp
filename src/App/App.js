import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React from 'react'

import GlobalStyle from '../library/styling/globalStyles'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/generic/Layout'
import theme from '../theme'
import useAuthentication from '../library/useAuthentication'
import { useRoutes } from '../library/useRoutes'
import {
  mermaidDataPropType,
  useMermaidData,
} from '../library/mermaidData/useMermaidData'
import useOnlineStatus from '../library/useOnlineStatus'
import { CustomToastContainer } from '../components/generic/toast'

function App({ mermaidDbAccessInstance }) {
  const { isOnline } = useOnlineStatus()
  const {
    auth0Token,
    isMermaidAuthenticated,
    logoutMermaid,
  } = useAuthentication({
    isOnline,
  })
  const mermaidData = useMermaidData({
    auth0Token,
    isMermaidAuthenticated,
    isOnline,
    mermaidDbAccessInstance,
  })
  const { routes } = useRoutes({ mermaidData })

  const layoutProps = {
    header: (
      <Header
        currentUser={mermaidData.currentUser}
        isOnline={isOnline}
        logout={logoutMermaid}
      />
    ),
    footer: <Footer />,
  }

  const isMermaidAuthenticatedAndReady =
    isMermaidAuthenticated && mermaidData.currentUser

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
  mermaidDbAccessInstance: mermaidDataPropType.isRequired,
}

export default App
