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
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/nonExistantProjectId/management-regimes/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  expect(await screen.findByText("The item with the id nonExistantProjectId can't be found."))
})

test('Online management regimes (plural) shows no info associated with project id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/nonExistantProjectId/management-regimes/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  expect(await screen.findByText("The item with the id nonExistantProjectId can't be found."))
})
