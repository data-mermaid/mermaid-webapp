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

test('Offline fish belt collect shows no info associated with RECORD id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/fishbelt/nonExistantRecordId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      "The item with the id nonExistantRecordId can't be found.",
    ),
  )
})

test('Online fish belt collect shows no info associated with RECORD id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/fishbelt/nonExistantRecordId'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      "The item with the id nonExistantRecordId can't be found.",
    ),
  )
})

test('Offline fish belt collect shows no info associated with PROJECT id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/collecting/fishbelt/5'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      "The item with the id nonExistantProjectId can't be found.",
    ),
  )
})

test('Online fish belt collect shows no info associated with PROJECT id view ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/nonExistantProjectId/collecting/fishbelt/5'],
    dexieInstance,
  })

  expect(
    await screen.findByText(
      "The item with the id nonExistantProjectId can't be found.",
    ),
  )
})
