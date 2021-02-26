import { Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import React from 'react'

import GlobalStyle from '../library/styling/globalStyles'
import Breadcrumbs from '../components/generic/Breadcrumbs'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/generic/Layout'
import theme from '../theme'
import useEnsureLogin from '../library/useEnsureLogin'
import { useRoutes } from '../library/useRoutes'
import { useMermaidApi } from '../ApiServices/useMermaidApi'

function App() {
  const layoutProps = {
    header: <Header />,
    footer: <Footer />,
  }

  const { isAuthenticated } = useEnsureLogin()
  const apiService = useMermaidApi()
  const { routes, getBreadCrumbs } = useRoutes(apiService)

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {isAuthenticated && (
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

export default App
