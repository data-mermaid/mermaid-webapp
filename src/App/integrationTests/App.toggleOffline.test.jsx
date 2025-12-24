import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticated,
  waitForElementToBeRemoved,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Starting ONLINE - Toggle is checked and switched to OFFLINE, some navigation links will disappear. Then navigation links reappear after clicking toggle again', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticated(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/'],
    },
    { dexieCurrentUserInstance, dexiePerUserDataInstance },
  )

  const sideNav = await screen.findByTestId('content-page-side-nav')

  const offlineToggleSwitchTestIdBeforeFirstClick = screen.getByTestId('offline-toggle-switch-test')

  await user.click(offlineToggleSwitchTestIdBeforeFirstClick)

  expect(await screen.findByTestId('status-offline')).toBeInTheDocument()

  expect(within(sideNav).queryByTestId('nav-submitted')).not.toBeInTheDocument()
  expect(within(sideNav).queryByTestId('nav-project-info')).not.toBeInTheDocument()
  expect(within(sideNav).queryByTestId('nav-users')).not.toBeInTheDocument()
  expect(within(sideNav).queryByTestId('nav-data-sharing')).not.toBeInTheDocument()

  const offlineToggleSwitchTestIdAfterFirstClick = screen.getByTestId('offline-toggle-switch-test')

  await user.click(offlineToggleSwitchTestIdAfterFirstClick)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  expect(await screen.findByTestId('status-online')).toBeInTheDocument()

  expect(within(sideNav).getByTestId('nav-submitted')).toBeInTheDocument()
  expect(within(sideNav).getByTestId('nav-project-info')).toBeInTheDocument()
  expect(within(sideNav).getByTestId('nav-users')).toBeInTheDocument()
  expect(within(sideNav).getByTestId('nav-data-sharing')).toBeInTheDocument()
})

test('Navigator online - Toggle switch is not checked, and is enabled', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const offlineToggleSwitchTestId = await screen.findByTestId('offline-toggle-switch-test')

  expect(offlineToggleSwitchTestId).not.toBeChecked()
  expect(offlineToggleSwitchTestId).toBeEnabled()
})

test('Navigator offline - Toggle switch is checked and disabled', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const offlineToggleSwitchTestId = await screen.findByTestId('offline-toggle-switch-test')

  expect(offlineToggleSwitchTestId).toBeChecked()
  expect(offlineToggleSwitchTestId).toBeDisabled()
})

test('Server is reachable - Toggle switch is not checked, and is enabled', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const offlineToggleSwitchTestId = await screen.findByTestId('offline-toggle-switch-test')

  expect(offlineToggleSwitchTestId).not.toBeChecked()
  expect(offlineToggleSwitchTestId).toBeEnabled()
})

test('Server is unreachable - Toggle switch is not checked, and is enabled', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.get(`${apiBaseUrl}/health`, (req, res) => {
      return res.networkError('Custom network error message')
    }),
  )

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const offlineToggleSwitchTestId = await screen.findByTestId('offline-toggle-switch-test')

  expect(offlineToggleSwitchTestId).toBeChecked()
  expect(offlineToggleSwitchTestId).toBeDisabled()
})
