import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  screen,
  renderAuthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

// this test suite is broken up into two for performance reasons

test('App renders show page unavailable offline when navigate to Admin page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/admin'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('This page is unavailable offline.'))
})

test('App renders show page unavailable offline when navigate to Users page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/users'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('This page is unavailable offline.'))
})

test('App renders show page unavailable offline when navigate to Fish Families page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/fish-families'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('This page is unavailable offline.'))
})

test('App renders show page unavailable offline when navigate to Data Sharing page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/projects/5/data-sharing'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  expect(await screen.findByText('This page is unavailable offline.'))
})
