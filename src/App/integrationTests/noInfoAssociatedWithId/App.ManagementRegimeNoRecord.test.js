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

test('Offline management regime shows no info associated with MANAGEMENT REGIME id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/management-regimes/nonExistantMrId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantMrId, cannot be found.',
    ),
  )
})

test('Online management regime shows no info associated with MANAGEMENT REGIME id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/management-regimes/nonExistantMrId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantMrId, cannot be found.',
    ),
  )
})

test('Offline management regime shows no info associated with PROJECT id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/1'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantProjectId, cannot be found.',
    ),
  )
})

test('Online management regime shows no info associated with PROJECT id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/1'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with the id, nonExistantProjectId, cannot be found.',
    ),
  )
})

test('Offline management regime shows no info associated with PROJECT or MANAGEMENT REGIME id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/nonExistantMrId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      'Details: information associated with one or more of the following ids cannot be found: nonExistantMrId,nonExistantProjectId',
    ),
  )
})

test('Online management regime shows no info associated with PROJECT or MANAGEMENT REGIME id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/nonExistantMrId'],
    dexieInstance,
  })
  expect(
    await screen.findByText(
      'Details: information associated with one or more of the following ids cannot be found: nonExistantMrId,nonExistantProjectId',
    ),
  )
})
