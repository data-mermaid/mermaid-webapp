import { Auth0Context } from '@auth0/auth0-react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components/macro'
import PropTypes from 'prop-types'
import React from 'react'

import theme from '../theme'
import { OnlineStatusProvider } from '../library/useOnlineStatus/OnlineStatusProvider'

const BasicProviders = ({ children }) => (
  <MemoryRouter>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </MemoryRouter>
)

const AuthenticatedProviders = ({ children }) => (
  <Auth0Context.Provider
    value={{
      isAuthenticated: true,
      user: { name: 'Fake Auth0 User' },
      logout: () => {},
      getAccessTokenSilently: () => Promise.resolve('fake-token'),
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

const renderAuthenticatedOnline = (ui, options) => {
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders>
        <OnlineStatusProvider value={{ isOnline: true }}>
          {children}
        </OnlineStatusProvider>
      </AuthenticatedProviders>
    )
  }

  return render(ui, {
    wrapper,
    ...options,
  })
}

const renderUnauthenticatedOnline = (ui, options) => {
  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders>
        <OnlineStatusProvider value={{ isOnline: true }}>
          {children}
        </OnlineStatusProvider>
      </UnauthenticatedProviders>
    )
  }

  render(ui, { wrapper, ...options })
}

const renderAuthenticatedOffline = (ui, options) => {
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders>
        <OnlineStatusProvider value={{ isOnline: false }}>
          {children}
        </OnlineStatusProvider>
      </AuthenticatedProviders>
    )
  }

  return render(ui, {
    wrapper,
    ...options,
  })
}

const renderUnauthenticatedOffline = (ui, options) => {
  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders>
        <OnlineStatusProvider value={{ isOnline: false }}>
          {children}
        </OnlineStatusProvider>
      </UnauthenticatedProviders>
    )
  }

  return render(ui, { wrapper, ...options })
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
