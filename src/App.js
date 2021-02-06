import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'

import Breadcrumbs from './components/generic/Breadcrumbs'
import Footer from './components/Footer'
import Header from './components/Header'
import Layout from './components/generic/Layout'
import routes, { getBreadCrumbs } from './routes'
import theme from './theme'

function App() {
  const layoutProps = {
    header: <Header />,
    footer: <Footer />,
  }

  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect()
    }
  }, [isLoading])

  return (
    isAuthenticated && (
      <ThemeProvider theme={theme}>
        <Router>
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
        </Router>
      </ThemeProvider>
    )
  )
}

export default App
