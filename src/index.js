import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

import { App } from './App'
import { OnlineStatusProvider } from './library/onlineStatusContext'
import dexieInstance from './App/mermaidData/dexieInstance'
import { SyncStatusProvider } from './App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      scope="read:current_user update:current_user_metadata"
    >
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <OnlineStatusProvider>
          <SyncStatusProvider>
            <App dexieInstance={dexieInstance} />
          </SyncStatusProvider>
        </OnlineStatusProvider>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
