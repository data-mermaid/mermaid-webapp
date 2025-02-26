import { Auth0Context } from '@auth0/auth0-react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import PropTypes from 'prop-types'
import React from 'react'
import userEvent from '@testing-library/user-event'

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
import { CurrentProjectProvider } from '../App/CurrentProjectContext'
import { HttpResponseErrorHandlerProvider } from '../App/HttpResponseErrorHandlerContext'
import { getMockDexieInstancesAllSuccess } from './mockDexie'
import { DexiePerUserDataInstanceProvider } from '../App/dexiePerUserDataInstanceContext'
import { BellNotificationProvider } from '../App/BellNotificationContext'
import mockMermaidData from './mockMermaidData'
import { ClearPersistedFormDataHackProvider } from '../App/ClearDirtyFormDataHackContext'

const fakeCurrentUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
  last_name: 'FakeLastNameOffline',
  full_name: 'FakeFirstNameOffline FakeLastNameOffline',
  projects: [{ id: 'fake-project-id', name: 'FakeProjectName', role: 90 }],
}

const AuthenticatedProviders = ({ children, isSyncInProgressOverride = false }) => (
  <Auth0Context.Provider
    value={{
      isAuthenticated: true,
      user: { name: 'Fake Auth0 User' },
      logout: () => {},
      getAccessTokenSilently: () => Promise.resolve('fake-token'),
    }}
  >
    <ThemeProvider theme={theme}>
      <SyncStatusProvider value={isSyncInProgressOverride ? { isSyncInProgress: false } : {}}>
        <CurrentUserProvider value={{ currentUser: fakeCurrentUser }}>
          <CurrentProjectProvider>
            <HttpResponseErrorHandlerProvider value={() => {}}>
              <BellNotificationProvider
                value={{
                  notifications: mockMermaidData.notifications,
                  deleteNotification: () => {},
                }}
              >
                {children}
              </BellNotificationProvider>
            </HttpResponseErrorHandlerProvider>
          </CurrentProjectProvider>
        </CurrentUserProvider>
      </SyncStatusProvider>
    </ThemeProvider>
  </Auth0Context.Provider>
)

const UnauthenticatedProviders = ({ children }) => (
  <Auth0Context.Provider
    value={{
      isAuthenticated: false,
      loginWithRedirect: () => {},
      getAccessTokenSilently: getFakeAccessToken,
    }}
  >
    <ThemeProvider theme={theme}>
      <SyncStatusProvider>
        <CurrentUserProvider value={undefined}>
          <CurrentProjectProvider>
            <HttpResponseErrorHandlerProvider value={() => {}}>
              <BellNotificationProvider value={undefined}>{children}</BellNotificationProvider>
            </HttpResponseErrorHandlerProvider>
          </CurrentProjectProvider>
        </CurrentUserProvider>
      </SyncStatusProvider>
    </ThemeProvider>
  </Auth0Context.Provider>
)

AuthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
  isSyncInProgressOverride: PropTypes.bool,
}

UnauthenticatedProviders.propTypes = {
  children: PropTypes.node.isRequired,
}

const renderAuthenticated = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance, isSyncInProgressOverride } = {},
) => {
  const { dexiePerUserDataInstance: defaultDexieUserDataDatabaseInstance } =
    getMockDexieInstancesAllSuccess()
  const dexieUserDataDatabaseInstanceToUse =
    dexiePerUserDataInstance ?? defaultDexieUserDataDatabaseInstance

  const router = createMemoryRouter([{ path: '*', element: ui }], {
    initialEntries,
  })
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders isSyncInProgressOverride={isSyncInProgressOverride}>
        <DatabaseSwitchboardInstanceProvider
          value={getMockOnlineDatabaseSwitchboardInstance({
            dexiePerUserDataInstance,
          })}
        >
          <OnlineStatusProvider>
            <DexiePerUserDataInstanceProvider
              value={{ dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse }}
            >
              <ClearPersistedFormDataHackProvider value={router}>
                <RouterProvider router={router}>{children}</RouterProvider>
              </ClearPersistedFormDataHackProvider>
            </DexiePerUserDataInstanceProvider>
          </OnlineStatusProvider>
        </DatabaseSwitchboardInstanceProvider>
      </AuthenticatedProviders>
    )
  }

  return {
    render: render(ui, {
      wrapper,
      ...renderOptions,
    }),
    user: userEvent.setup(),
  }
}

const renderAuthenticatedOnline = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance, isSyncInProgressOverride } = {},
) => {
  const { dexiePerUserDataInstance: defaultDexieUserDataDatabaseInstance } =
    getMockDexieInstancesAllSuccess()
  const dexieUserDataDatabaseInstanceToUse =
    dexiePerUserDataInstance ?? defaultDexieUserDataDatabaseInstance

  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: ui,
      },
    ],
    {
      initialEntries,
    },
  )
  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders isSyncInProgressOverride={isSyncInProgressOverride}>
        <DatabaseSwitchboardInstanceProvider
          value={getMockOnlineDatabaseSwitchboardInstance({
            dexiePerUserDataInstance,
          })}
        >
          <OnlineStatusProvider value={{ isAppOnline: true }}>
            <DexiePerUserDataInstanceProvider
              value={{ dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse }}
            >
              <ClearPersistedFormDataHackProvider value={router}>
                <RouterProvider router={router}>{children}</RouterProvider>
              </ClearPersistedFormDataHackProvider>
            </DexiePerUserDataInstanceProvider>
          </OnlineStatusProvider>
        </DatabaseSwitchboardInstanceProvider>
      </AuthenticatedProviders>
    )
  }

  return {
    render: render(ui, {
      wrapper,
      ...renderOptions,
    }),
    user: userEvent.setup(),
  }
}

const renderUnauthenticatedOnline = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance } = {},
) => {
  const { dexiePerUserDataInstance: defaultDexieUserDataDatabaseInstance } =
    getMockDexieInstancesAllSuccess()
  const dexieUserDataDatabaseInstanceToUse =
    dexiePerUserDataInstance ?? defaultDexieUserDataDatabaseInstance

  const router = createMemoryRouter([{ path: '*', element: ui }], {
    initialEntries,
  })
  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders>
        <OnlineStatusProvider value={{ isAppOnline: true }}>
          <DexiePerUserDataInstanceProvider
            value={{ dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse }}
          >
            <ClearPersistedFormDataHackProvider value={router}>
              <RouterProvider router={router}>{children}</RouterProvider>
            </ClearPersistedFormDataHackProvider>
          </DexiePerUserDataInstanceProvider>
        </OnlineStatusProvider>
      </UnauthenticatedProviders>
    )
  }

  return {
    render: render(ui, {
      wrapper,
      ...renderOptions,
    }),
    user: userEvent.setup(),
  }
}

const renderAuthenticatedOffline = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance, isSyncInProgressOverride } = {},
) => {
  const { dexiePerUserDataInstance: defaultDexieUserDataDatabaseInstance } =
    getMockDexieInstancesAllSuccess()
  const dexieUserDataDatabaseInstanceToUse =
    dexiePerUserDataInstance ?? defaultDexieUserDataDatabaseInstance

  const router = createMemoryRouter([{ path: '*', element: ui }], {
    initialEntries,
  })

  const wrapper = ({ children }) => {
    return (
      <AuthenticatedProviders isSyncInProgressOverride={isSyncInProgressOverride}>
        <DatabaseSwitchboardInstanceProvider
          value={getMockOfflineDatabaseSwitchboardInstance({
            dexiePerUserDataInstance,
          })}
        >
          <OnlineStatusProvider value={{ isAppOnline: false }}>
            <DexiePerUserDataInstanceProvider
              value={{ dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse }}
            >
              <ClearPersistedFormDataHackProvider value={router}>
                <RouterProvider router={router}>{children}</RouterProvider>
              </ClearPersistedFormDataHackProvider>
            </DexiePerUserDataInstanceProvider>
          </OnlineStatusProvider>
        </DatabaseSwitchboardInstanceProvider>
      </AuthenticatedProviders>
    )
  }

  return {
    render: render(ui, {
      wrapper,
      ...renderOptions,
    }),
    user: userEvent.setup(),
  }
}

const renderUnauthenticatedOffline = (
  ui,
  { renderOptions, initialEntries, dexiePerUserDataInstance } = {},
) => {
  const { dexiePerUserDataInstance: defaultDexieUserDataDatabaseInstance } =
    getMockDexieInstancesAllSuccess()
  const dexieUserDataDatabaseInstanceToUse =
    dexiePerUserDataInstance ?? defaultDexieUserDataDatabaseInstance

  const router = createMemoryRouter([{ path: '*', element: ui }], {
    initialEntries,
  })

  const wrapper = ({ children }) => {
    return (
      <UnauthenticatedProviders>
        <OnlineStatusProvider value={{ isAppOnline: false }}>
          <DexiePerUserDataInstanceProvider
            value={{ dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse }}
          >
            <ClearPersistedFormDataHackProvider value={router}>
              <RouterProvider router={router}>{children}</RouterProvider>
            </ClearPersistedFormDataHackProvider>
          </DexiePerUserDataInstanceProvider>
        </OnlineStatusProvider>
      </UnauthenticatedProviders>
    )
  }

  return {
    render: render(ui, {
      wrapper,
      ...renderOptions,
    }),
    user: userEvent.setup(),
  }
}

const renderOverride = () => {
  throw new Error(
    'Please use renderAuthenticatedOnline, renderUnauthenticatedOnline, renderAuthenticatedOffline, or renderUnauthenticatedOffline instead of render.',
  )
}

export { default as mockMermaidApiAllSuccessful } from './mockMermaidApiAllSuccessful'
export * from '@testing-library/react'
export { waitFor, waitForElementToBeRemoved } from '@testing-library/react' // helps with auto imports
export {
  renderOverride as render,
  renderAuthenticated,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
}
