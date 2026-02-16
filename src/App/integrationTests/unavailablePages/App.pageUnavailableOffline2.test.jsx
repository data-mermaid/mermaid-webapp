import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  screen,
  renderAuthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

// this test suite is broken up into two for performance reasons

test('App renders show page unavailable offline when navigate to Project Info page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/project-info'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('page-unavailable-main-text')).toBeInTheDocument()
})

test('App renders show page unavailable offline when navigate to Users page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/users'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('page-unavailable-main-text')).toBeInTheDocument()
})

test('App renders show page unavailable offline when navigate to Fish Families page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/fish-families'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('page-unavailable-main-text')).toBeInTheDocument()
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

  expect(await screen.findByTestId('page-unavailable-main-text')).toBeInTheDocument()
})
