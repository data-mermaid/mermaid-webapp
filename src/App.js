import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import React from 'react'

import Breadcrumbs from './components/generic/Breadcrumbs'
import Footer from './components/Footer'
import Header from './components/Header'
import Layout from './components/generic/Layout'

import routes, { getBreadCrumbs } from './routes'

function App() {
  const layoutProps = {
    header: <Header />,
    footer: <Footer />,
  }

  return (
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
  )
}

export default App
