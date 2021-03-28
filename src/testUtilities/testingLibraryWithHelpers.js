import { Auth0Context } from '@auth0/auth0-react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components/macro'
import PropTypes from 'prop-types'
import React from 'react'

import theme from '../theme'
import { OnlineStatusProvider } from '../library/onlineStatusContext'

const AuthenticatedProviders = ({ children, initialEntries }) => (
  <Auth0Context.Provider
    value={{
      isAuthenticated: true,
      user: { name: 'Fake Auth0 User' },
      logout: () => {},
      getAccessTokenSilently: () => Promise.resolve('fake-token'),
    }}
  >
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MemoryRouter>
  </Auth0Context.Provider>
)

const UnauthenticatedProviders = ({ children, initialEntries }) => (
  <Auth0Context.Provider
    value={{ isAuthenticated: false, loginWithRedirect: () => {} }}
  >
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MemoryRouter>
  </Auth0Context.Provider>
)

AuthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
  initialEntries: PropTypes.arrayOf(PropTypes.string),
}
AuthenticatedProviders.defaultProps = {
  initialEntries: undefined,
}
UnauthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
  initialEntries: PropTypes.arrayOf(PropTypes.string),
}
UnauthenticatedProviders.defaultProps = {
  initialEntries: undefined,
}

const renderAuthenticatedOnline = (
  ui,
  { renderOptions, initialEntries } = {},
) => {
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders initialEntries={initialEntries}>
        <OnlineStatusProvider value={{ isOnline: true }}>
          {children}
        </OnlineStatusProvider>
      </AuthenticatedProviders>
    )
  }

  return render(ui, {
    wrapper,
    ...renderOptions,
  })
}

const renderUnauthenticatedOnline = (
  ui,
  { renderOptions, initialEntries } = {},
) => {
  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders initialEntries={initialEntries}>
        <OnlineStatusProvider value={{ isOnline: true }}>
          {children}
        </OnlineStatusProvider>
      </UnauthenticatedProviders>
    )
  }

  render(ui, { wrapper, ...renderOptions })
}

const renderAuthenticatedOffline = (
  ui,
  { renderOptions, initialEntries } = {},
) => {
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders initialEntries={initialEntries}>
        <OnlineStatusProvider value={{ isOnline: false }}>
          {children}
        </OnlineStatusProvider>
      </AuthenticatedProviders>
    )
  }

  return render(ui, {
    wrapper,
    ...renderOptions,
  })
}

const renderUnauthenticatedOffline = (
  ui,
  { renderOptions, initialEntries } = {},
) => {
  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders initialEntries={initialEntries}>
        <OnlineStatusProvider value={{ isOnline: false }}>
          {children}
        </OnlineStatusProvider>
      </UnauthenticatedProviders>
    )
  }

  return render(ui, { wrapper, ...renderOptions })
}

const renderOverride = () => {
  throw new Error(
    'Please use renderAuthenticatedOnline, renderUnauthenticatedOnline, renderAuthenticatedOffline, or renderUnauthenticatedOffline instead of render.',
  )
}

export { default as mockMermaidApiAllSuccessful } from './mockMermaidApiAllSuccessful'
export * from '@testing-library/react'
export {
  renderOverride as render,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
}
