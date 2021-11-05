import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticated,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Appropriate online status message shows when navigator is online', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail
  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "You're ONLINE",
  )
  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "You're OFFLINE. Some contents may be out of date.",
  )
})
test('Appropriate online status message shows when navigator is offline', async () => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail
  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "You're ONLINE",
  )
  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "You're OFFLINE. Some contents may be out of date.",
  )
})

test('Appropriate online status message shows when server is reachable', async () => {
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail
  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "You're ONLINE",
  )
  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "You're OFFLINE. Some contents may be out of date.",
  )
})
test('Appropriate online status message shows when server is unreachable', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.get(`${apiBaseUrl}/health`, (req, res) => {
      return res.networkError('Custom network error message')
    }),
  )
  renderAuthenticated(<App dexieInstance={getMockDexieInstanceAllSuccess()} />)
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail
  // timeout is necessary here because the server ping happens every 5 seconds.

  expect(await screen.findByTestId('offline-toggle-switch-label')).not.toHaveTextContent(
    "You're ONLINE",
  )

  expect(await screen.findByTestId('offline-toggle-switch-label')).toHaveTextContent(
    "You're OFFLINE. Some contents may be out of date.",
  )
})
