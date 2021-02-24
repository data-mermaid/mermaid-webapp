import { Auth0Context } from '@auth0/auth0-react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components/macro'
import PropTypes from 'prop-types'
import React from 'react'

import theme from '../theme'

const BasicProviders = ({ children }) => (
  <MemoryRouter>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </MemoryRouter>
)

const AuthenticatedProviders = ({ children }) => (
  <Auth0Context.Provider
    value={{
      isAuthenticated: true,
      user: { name: 'Fake User' },
      logout: () => {},
    }}
  >
    <BasicProviders>{children}</BasicProviders>
  </Auth0Context.Provider>
)

const UnauthenticatedProviders = ({ children }) => (
  <Auth0Context.Provider
    value={{ isAuthenticated: false, loginWithRedirect: () => {} }}
  >
    <BasicProviders>{children}</BasicProviders>
  </Auth0Context.Provider>
)

AuthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
}
UnauthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
}
BasicProviders.propTypes = {
  children: PropTypes.node.isRequired,
}

const renderAuthenticatedOnline = (ui, options) =>
  render(ui, { wrapper: AuthenticatedProviders, ...options })
const renderUnauthenticatedOnline = (ui, options) =>
  render(ui, { wrapper: UnauthenticatedProviders, ...options })

const renderAuthenticatedOffline = (ui, options) => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)

  return render(ui, {
    wrapper: AuthenticatedProviders,
    ...options,
  })
}

const renderUnauthenticatedOffline = (ui, options) => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)

  return render(ui, { wrapper: UnauthenticatedProviders, ...options })
}

const renderOverride = () => {
  throw new Error(
    'Please use renderAuthenticatedOnline, renderUnauthenticatedOnline, renderAuthenticatedOffline, or renderUnauthenticatedOffline instead of render.',
  )
}

export * from '@testing-library/react'
export {
  renderOverride as render,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
}
