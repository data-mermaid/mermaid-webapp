import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticated,
  waitForElementToBeRemoved,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Starting ONLINE - Toggle is checked and switched to OFFLINE, some navigation links will disappear. Then navigation links reappear after clicking toggle again', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticated(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/'],
  })

  const sideNav = await screen.findByTestId('content-page-side-nav')

  const offlineToggleSwitchTestIdBeforeFirstClick = screen.getByTestId(
    'offline-toggle-switch-test',
  )

  userEvent.click(offlineToggleSwitchTestIdBeforeFirstClick)

  expect(
    await screen.findByTestId('offline-toggle-switch-label'),
  ).toHaveTextContent("You're OFFLINE. Some contents may be out of date.")

  expect(
    within(sideNav).queryByRole('link', { name: 'Submitted' }),
  ).not.toBeInTheDocument()
  expect(
    within(sideNav).queryByRole('link', { name: 'Project Info' }),
  ).not.toBeInTheDocument()
  expect(
    within(sideNav).queryByRole('link', { name: 'Users' }),
  ).not.toBeInTheDocument()
  expect(
    within(sideNav).queryByRole('link', { name: 'Data Sharing' }),
  ).not.toBeInTheDocument()

  const offlineToggleSwitchTestIdAfterFirstClick = screen.getByTestId(
    'offline-toggle-switch-test',
  )

  userEvent.click(offlineToggleSwitchTestIdAfterFirstClick)

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  expect(
    await screen.findByTestId('offline-toggle-switch-label'),
  ).toHaveTextContent("You're ONLINE")

  expect(
    within(sideNav).queryByRole('link', { name: 'Submitted' }),
  ).toBeInTheDocument()
  expect(
    within(sideNav).queryByRole('link', { name: 'Project Info' }),
  ).toBeInTheDocument()
  expect(
    within(sideNav).queryByRole('link', { name: 'Users' }),
  ).toBeInTheDocument()
  expect(
    within(sideNav).queryByRole('link', { name: 'Data Sharing' }),
  ).toBeInTheDocument()
})

test('Navigator online - Toggle switch is not checked, and is enabled', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)

  const offlineToggleSwitchTestId = await screen.findByTestId(
    'offline-toggle-switch-test',
  )

  expect(offlineToggleSwitchTestId).not.toBeChecked()
  expect(offlineToggleSwitchTestId).toBeEnabled()
})

test('Navigator offline - Toggle switch is checked and disabled', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)

  const offlineToggleSwitchTestId = await screen.findByTestId(
    'offline-toggle-switch-test',
  )

  expect(offlineToggleSwitchTestId).toBeChecked()
  expect(offlineToggleSwitchTestId).toBeDisabled()
})

test('Server is reachable - Toggle switch is not checked, and is enabled', async () => {
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)

  const offlineToggleSwitchTestId = await screen.findByTestId(
    'offline-toggle-switch-test',
  )

  expect(offlineToggleSwitchTestId).not.toBeChecked()
  expect(offlineToggleSwitchTestId).toBeEnabled()
})

test('Server is unreachable - Toggle switch is not checked, and is enabled', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.get(`${apiBaseUrl}/health`, (req, res) => {
      return res.networkError('Custom network error message')
    }),
  )
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)

  const offlineToggleSwitchTestId = await screen.findByTestId(
    'offline-toggle-switch-test',
  )

  expect(offlineToggleSwitchTestId).toBeChecked()
  expect(offlineToggleSwitchTestId).toBeDisabled()
})
