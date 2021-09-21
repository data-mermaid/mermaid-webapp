import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  screen,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../App'

test('Offline site shows no info associated with SITE id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/nonExistantSiteId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantSiteId, cannot be found.',
    ),
  )
})

test('Online site shows no info associated with SITE id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/nonExistantSiteId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantSiteId, cannot be found.',
    ),
  )
})

test('Offline site shows no info associated with PROJECT id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/1'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantProjectId, cannot be found.',
    ),
  )
})

test('Online site shows no info associated with PROJECT id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/1'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantProjectId, cannot be found.',
    ),
  )
})

test('Offline site shows no info associated with PROJECT or SITE id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/nonExistantSiteId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with one or more of the following ids cannot be found: nonExistantSiteId,nonExistantProjectId',
    ),
  )
})

test('Online site shows no info associated with PROJECT or SITE id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/sites/nonExistantSiteId'],
    dexieInstance,
  })
  expect(
    await screen.findByText(
      'Details: information associated with one or more of the following ids cannot be found: nonExistantSiteId,nonExistantProjectId',
    ),
  )
})
