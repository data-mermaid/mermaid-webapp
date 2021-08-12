import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import {
  screen,
  renderAuthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

// this test suite is broken up into two for performance reasons

test('App renders show page unavailable offline when navigate to Admin page while offline.', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    { initialEntries: ['/projects/5/admin'] },
  )

  expect(await screen.findByText('This page is unavailable when offline'))
})

test('App renders show page unavailable offline when navigate to Users page while offline.', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    { initialEntries: ['/projects/5/users'] },
  )

  expect(await screen.findByText('This page is unavailable when offline'))
})

test('App renders show page unavailable offline when navigate to Fish Families page while offline.', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    { initialEntries: ['/projects/5/fish-families'] },
  )

  expect(await screen.findByText('This page is unavailable when offline'))
})

test('App renders show page unavailable offline when navigate to Data Sharing page while offline.', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(
    <App dexieInstance={dexieInstance} />,
    { initialEntries: ['/projects/5/data-sharing'] },
    dexieInstance,
  )

  expect(await screen.findByText('This page is unavailable when offline'))
})
