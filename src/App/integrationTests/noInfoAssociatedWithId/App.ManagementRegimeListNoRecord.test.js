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

test('Offline management regimes (plural) shows no info associated with project id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      "The item with the id nonExistantProjectId can't be found.",
    ),
  )
})

test('Online management regimes (plural) shows no info associated with project id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      "The item with the id nonExistantProjectId can't be found.",
    ),
  )
})
