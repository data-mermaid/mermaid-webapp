import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  screen,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../App'

test('Offline site shows no info associated with SITE id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App />, {
    initialEntries: ['/projects/5/sites/nonExistantSiteId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText("The item with the id nonExistantSiteId can't be found."))
})

test('Online site shows no info associated with SITE id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App />, {
    initialEntries: ['/projects/5/sites/nonExistantSiteId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText("The item with the id nonExistantSiteId can't be found."))
})

test('Offline site shows no info associated with PROJECT id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/1'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText("The item with the id nonExistantProjectId can't be found."))
})

test('Online site shows no info associated with PROJECT id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/1'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText("The item with the id nonExistantProjectId can't be found."))
})

test('Offline site shows no info associated with PROJECT or SITE id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/nonExistantSiteId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(
    await screen.findByText(
      "The items with the ids nonExistantSiteId,nonExistantProjectId can't be found.",
    ),
  )
})

test('Online site shows no info associated with PROJECT or SITE id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/nonExistantSiteId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  expect(
    await screen.findByText(
      "The items with the ids nonExistantSiteId,nonExistantProjectId can't be found.",
    ),
  )
})
