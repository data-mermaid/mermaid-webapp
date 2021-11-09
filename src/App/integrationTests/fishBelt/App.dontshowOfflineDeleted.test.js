import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

test('Collect page only shows records that arent marked to be deleted next sync', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  const aRecordToMarkAsDeleted = (await dexieInstance.collect_records.toArray())[0]

  await dexieInstance.collect_records.put({
    ...aRecordToMarkAsDeleted,
    _deleted: true,
  })

  renderAuthenticatedOffline(
    <App dexieInstance={dexieInstance} />,
    {
      initialEntries: ['/projects/5/collecting/'],
    },
    dexieInstance,
  )

  userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '100')

  const rows = await screen.findAllByRole('row')

  expect(rows).toHaveLength(16)
})

test('Sites page only shows records that arent marked to be deleted next sync', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  const aRecordToMarkAsDeleted = (await dexieInstance.project_sites.toArray())[0]

  await dexieInstance.project_sites.put({
    ...aRecordToMarkAsDeleted,
    _deleted: true,
  })

  renderAuthenticatedOffline(
    <App dexieInstance={dexieInstance} />,
    {
      initialEntries: ['/projects/5/sites/'],
    },
    dexieInstance,
  )

  userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '100')

  const rows = await screen.findAllByRole('row')

  expect(rows).toHaveLength(4)
})

test('Management Regimes page only shows records that arent marked to be deleted next sync', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  const aRecordToMarkAsDeleted = (await dexieInstance.project_managements.toArray())[0]

  await dexieInstance.project_managements.put({
    ...aRecordToMarkAsDeleted,
    _deleted: true,
  })

  renderAuthenticatedOffline(
    <App dexieInstance={dexieInstance} />,
    {
      initialEntries: ['/projects/5/management-regimes/'],
    },
    dexieInstance,
  )

  userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '100')

  const rows = await screen.findAllByRole('row')

  expect(rows).toHaveLength(3)
})
