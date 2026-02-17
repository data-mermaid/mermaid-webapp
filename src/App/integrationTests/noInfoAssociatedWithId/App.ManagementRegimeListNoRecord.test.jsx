import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import {
  screen,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../App'

test('Offline management regimes (plural) shows no info associated with project id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('ids-not-found')).toBeInTheDocument()
})

test('Online management regimes (plural) shows no info associated with project id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('ids-not-found')).toBeInTheDocument()
})
