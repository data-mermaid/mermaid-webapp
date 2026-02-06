import { expect, test } from "vitest";
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

test('Offline management regime shows no info associated with MANAGEMENT REGIME id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/management-regimes/nonExistantMrId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('The item with the id nonExistantMrId cannot be found.'))
})

test('Online management regime shows no info associated with MANAGEMENT REGIME id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/management-regimes/nonExistantMrId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('The item with the id nonExistantMrId cannot be found.'))
})

test('Offline management regime shows no info associated with PROJECT id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/1'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('The item with the id nonExistantProjectId cannot be found.'))
})

test('Online management regime shows no info associated with PROJECT id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/1'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('The item with the id nonExistantProjectId cannot be found.'))
})

test('Offline management regime shows no info associated with PROJECT or MANAGEMENT REGIME id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/nonExistantMrId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(
    await screen.findByText(
      'The items with the ids nonExistantMrId,nonExistantProjectId cannot be found.',
    ),
  )
})

test('Online management regime shows no info associated with PROJECT or MANAGEMENT REGIME id view ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/management-regimes/nonExistantMrId'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  expect(
    await screen.findByText(
      'The items with the ids nonExistantMrId,nonExistantProjectId cannot be found.',
    ),
  )
})
