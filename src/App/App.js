import { Route, Routes, Navigate, useOutletContext } from 'react-router-dom'

import React from 'react'

import { useRoutes } from './useRoutes'

import LoadingIndicator from '../components/LoadingIndicator/LoadingIndicator'
import PageNotFound from '../components/pages/PageNotFound'

import AppEnvionmentAndState from './AppEnvironmentAndState'

function App() {
  const { routes } = useRoutes() // convert this to const instead of hook so we can use it with data router

  const isMermaidAuthenticatedAndReady = useOutletContext()

  console.log({ isMermaidAuthenticatedAndReady })

  return (
    <>
      <Routes>
        <Route element={<AppEnvionmentAndState />}>
          {routes.map(({ path, Component }) => (
            <Route
              exact
              path={path}
              key={path}
              element={isMermaidAuthenticatedAndReady ? <Component /> : <LoadingIndicator />}
            />
          ))}
          <Route exact path="/" element={<Navigate to="/projects" replace />} />

          {/* The following route is required b/c of how Cloudfront handles root paths. This is
                            required for preview urls. When viewing a preview, you will need to append /index.html
                            like so: https://preview.app2.datamermaid.org/123/index.html */}
          <Route exact path="/index.html" element={<Navigate to="/projects" />} />
        </Route>
      </Routes>
      <Routes>
        <Route element={<AppEnvionmentAndState />}>
          <Route path="/*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <div>FOOOOOOOO: {isMermaidAuthenticatedAndReady}</div>
    </>
  )
}

export default App
