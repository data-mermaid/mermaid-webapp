import { Auth0Provider } from '@auth0/auth0-react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import reportWebVitals from './reportWebVitals'

import { App } from './App'
import { OnlineStatusProvider } from './library/onlineStatusContext'
import { SyncStatusProvider } from './App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import dexieCurrentUserInstance from './App/dexieCurrentUserInstance'
import { DexiePerUserDataInstanceProvider } from './App/dexiePerUserDataInstanceContext'
import { ClearPersistedFormDataHackProvider } from './App/ClearDirtyFormDataHackContext'

// Upgrading to react router v6 because of dependabot issues and data routers (createBrowserRouter) which is necessary for many functions we use(eg: useNavigate).
// We keep the jsx routes as defined in app.js instead of having ALL routes defined here because we were not able to have conditional rendering of the loader otherwise
const router = createBrowserRouter(
  [{ path: '*', element: <App dexieCurrentUserInstance={dexieCurrentUserInstance} /> }],
  { basename: import.meta.env.PUBLIC_URL },
)

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={import.meta.env.VITE_AUTH0_AUDIENCE}
      useRefreshTokens={true}
      // Note that while storing tokens in local storage provides persistence
      // across page refreshes and browser tabs, it increases the risk of
      // cross-site scripting (XSS) attacks.
      // More information here: https://auth0.com/docs/libraries/auth0-single-page-app-sdk#change-storage-options
      // Reccomend researching a different approach to authentication
      cacheLocation="localstorage"
      scope="read:current_user update:current_user_metadata"
    >
      <OnlineStatusProvider>
        <SyncStatusProvider>
          <DexiePerUserDataInstanceProvider>
            <ClearPersistedFormDataHackProvider value={router}>
              <RouterProvider router={router} />
            </ClearPersistedFormDataHackProvider>
          </DexiePerUserDataInstanceProvider>
        </SyncStatusProvider>
      </OnlineStatusProvider>
    </Auth0Provider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
