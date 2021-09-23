import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticated,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Toggle offline switch to offline, page turns offline, some navigation links will disappear', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticated(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/'],
  })

  const sideNav = await screen.findByTestId('content-page-side-nav')

  // Trying both test queries below, comment one and uncomment another.
  const offlineToggleSwitchTestId = screen.getByTestId(
    'offline-toggle-switch-test',
  )

  userEvent.click(offlineToggleSwitchTestId)

  expect(
    await screen.findByTestId('offline-toggle-switch-label'),
  ).toHaveTextContent("You're OFFLINE. Some contents may be out of date.")

  expect(
    within(sideNav).queryByRole('link', { name: 'Submitted' }),
  ).not.toBeInTheDocument()
})
