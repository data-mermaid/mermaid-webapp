import { Auth0Context } from '@auth0/auth0-react'
import React from 'react'
import App from './App'

export default {
  title: '_Mocked App',
  component: App,
}

export const LoggedIn = () => (
  <Auth0Context.Provider
    value={{ isAuthenticated: true, user: { name: 'Fake User' } }}
  >
    <App />
  </Auth0Context.Provider>
)
