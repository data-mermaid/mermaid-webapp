import { Auth0Context } from '@auth0/auth0-react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components/macro'
import PropTypes from 'prop-types'
import React from 'react'

import theme from '../theme'
import { OnlineStatusProvider } from '../library/onlineStatusContext'
import { DatabaseSwitchboardInstanceProvider } from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import {
  getMockOnlineDatabaseSwitchboardInstance,
  getMockOfflineDatabaseSwitchboardInstance,
} from './mockOnlineDatabaseSwitchboardInstance'
import { SyncStatusProvider } from '../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { getFakeAccessToken } from './getFakeAccessToken'
import { CurrentUserProvider } from '../App/CurrentUserContext'

const fakeCurrentUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
}

const AuthenticatedProviders = ({ children, initialEntries, isSyncInProgressOverride }) => (
  <Auth0Context.Provider
    value={{
      isAuthenticated: true,
      user: { name: 'Fake Auth0 User' },
      logout: () => {},
      getAccessTokenSilently: () => Promise.resolve('fake-token'),
    }}
  >
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <SyncStatusProvider value={isSyncInProgressOverride ? { isSyncInProgress: false } : {}}>
          <CurrentUserProvider value={fakeCurrentUser}>{children}</CurrentUserProvider>
        </SyncStatusProvider>
      </ThemeProvider>
    </MemoryRouter>
  </Auth0Context.Provider>
)

const UnauthenticatedProviders = ({ children, initialEntries }) => (
  <Auth0Context.Provider
    value={{
      isAuthenticated: false,
      loginWithRedirect: () => {},
      getAccessTokenSilently: getFakeAccessToken,
    }}
  >
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <SyncStatusProvider>
          <CurrentUserProvider value={undefined}>{children}</CurrentUserProvider>
        </SyncStatusProvider>
      </ThemeProvider>
    </MemoryRouter>
  </Auth0Context.Provider>
)

AuthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
  initialEntries: PropTypes.arrayOf(PropTypes.string),
  isSyncInProgressOverride: PropTypes.bool,
}
AuthenticatedProviders.defaultProps = {
  initialEntries: undefined,
  isSyncInProgressOverride: false,
}
UnauthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
  initialEntries: PropTypes.arrayOf(PropTypes.string),
}
UnauthenticatedProviders.defaultProps = {
  initialEntries: undefined,
}
const renderAuthenticated = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance, isSyncInProgressOverride } = {},
) => {
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders
        initialEntries={initialEntries}
        isSyncInProgressOverride={isSyncInProgressOverride}
      >
        <DatabaseSwitchboardInstanceProvider
          value={getMockOnlineDatabaseSwitchboardInstance({
            dexiePerUserDataInstance,
          })}
        >
          <OnlineStatusProvider>{children}</OnlineStatusProvider>
        </DatabaseSwitchboardInstanceProvider>
      </AuthenticatedProviders>
    )
  }

  return render(ui, {
    wrapper,
    ...renderOptions,
  })
}

const renderAuthenticatedOnline = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance, isSyncInProgressOverride } = {},
) => {
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders
        initialEntries={initialEntries}
        isSyncInProgressOverride={isSyncInProgressOverride}
      >
        <DatabaseSwitchboardInstanceProvider
          value={getMockOnlineDatabaseSwitchboardInstance({
            dexiePerUserDataInstance,
          })}
        >
          <OnlineStatusProvider value={{ isAppOnline: true }}>{children}</OnlineStatusProvider>
        </DatabaseSwitchboardInstanceProvider>
      </AuthenticatedProviders>
    )
  }

  return render(ui, {
    wrapper,
    ...renderOptions,
  })
}

const renderUnauthenticatedOnline = (ui, { renderOptions, initialEntries } = {}) => {
  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders initialEntries={initialEntries}>
        <OnlineStatusProvider value={{ isAppOnline: true }}>{children}</OnlineStatusProvider>
      </UnauthenticatedProviders>
    )
  }

  render(ui, { wrapper, ...renderOptions })
}

const renderAuthenticatedOffline = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance, isSyncInProgressOverride } = {},
) => {
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders
        initialEntries={initialEntries}
        isSyncInProgressOverride={isSyncInProgressOverride}
      >
        <DatabaseSwitchboardInstanceProvider
          value={getMockOfflineDatabaseSwitchboardInstance({
            dexiePerUserDataInstance,
          })}
        >
          <OnlineStatusProvider value={{ isAppOnline: false }}>{children}</OnlineStatusProvider>
        </DatabaseSwitchboardInstanceProvider>
      </AuthenticatedProviders>
    )
  }

  return render(ui, {
    wrapper,
    ...renderOptions,
  })
}

const renderUnauthenticatedOffline = (ui, { renderOptions, initialEntries } = {}) => {
  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders initialEntries={initialEntries}>
        <OnlineStatusProvider value={{ isAppOnline: false }}>{children}</OnlineStatusProvider>
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
  renderAuthenticated,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
}
