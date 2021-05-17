import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Appropriate online status message shows when app is online', async () => {
  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail
  expect(
    await screen.findByTestId('offline-toggle-switch-label'),
  ).toHaveTextContent("You're ONLINE")
  expect(
    await screen.findByTestId('offline-toggle-switch-label'),
  ).not.toHaveTextContent("You're OFFLINE. Some contents may be out of date.")
})
test('Appropriate online status message shows when app is offline', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )
  // we're using testId + tohaveTextContent here because the text is broken up by html and a regular findByText will fail
  expect(
    await screen.findByTestId('offline-toggle-switch-label'),
  ).not.toHaveTextContent("You're ONLINE")
  expect(
    await screen.findByTestId('offline-toggle-switch-label'),
  ).toHaveTextContent("You're OFFLINE. Some contents may be out of date.")
})
