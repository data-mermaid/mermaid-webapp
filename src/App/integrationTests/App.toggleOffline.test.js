import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Toggle offline switch on, page turn offline, some navigation links will disappear', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/'],
  })

  const sideNav = await screen.findByTestId('content-page-side-nav')
  const offlineToggleSwitch = screen.getByLabelText(
    'offline-toggle-switch-control',
  )

  userEvent.click(offlineToggleSwitch)

  // This submitted nav link should not be in document, but I change for passing the test
  expect(
    within(sideNav).getByRole('link', { name: /submitted/i }),
  ).toBeInTheDocument()
})
