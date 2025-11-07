import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticated,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Appropriate online status message shows when navigator is online', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail

  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "online_status",
  )
  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "offline_status",
  )
})
test('Appropriate online status message shows when navigator is offline', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail

  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "online_status",
  )
  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "offline_status",
  )
})

test('Appropriate online status message shows when server is reachable', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail

  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "online_status",
  )
  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "offline_status",
  )
})
test('Appropriate online status message shows when server is unreachable', async () => {
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
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail
  // timeout is necessary here because the server ping happens every 5 seconds.

  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "online_status",
  )

  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "offline_status",
  )
})
