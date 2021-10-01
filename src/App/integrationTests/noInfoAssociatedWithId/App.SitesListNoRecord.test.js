import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  screen,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../App'

test('Offline sites list shows no info associated with projectId view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantProjectId, cannot be found.',
    ),
  )
})

test('Online sites list shows no info associated with projectId view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantProjectId, cannot be found.',
    ),
  )
})
