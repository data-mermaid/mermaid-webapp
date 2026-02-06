import { expect, test } from "vitest";
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  waitFor,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

test('Collect page only shows records that arent marked to be deleted next sync', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const aRecordToMarkAsDeleted = (await dexiePerUserDataInstance.collect_records.toArray())[0]

  await dexiePerUserDataInstance.collect_records.put({
    ...aRecordToMarkAsDeleted,
    _deleted: true,
  })

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const pageSizeSelector = await screen.findByTestId('page-size-selector')

  await waitFor(() => expect(within(pageSizeSelector).getByText('20')))

  // show all the records
  await user.selectOptions(pageSizeSelector, '20')

  const rows = await screen.findAllByRole('row')

  expect(rows).toHaveLength(21)
})

test('Sites page only shows records that arent marked to be deleted next sync', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const aRecordToMarkAsDeleted = (await dexiePerUserDataInstance.project_sites.toArray())[0]

  await dexiePerUserDataInstance.project_sites.put({
    ...aRecordToMarkAsDeleted,
    _deleted: true,
  })

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/sites/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.selectOptions(await screen.findByTestId('page-size-selector'), '3')

  const rows = await screen.findAllByRole('row')

  expect(rows).toHaveLength(4)
})

test('Management Regimes page only shows records that arent marked to be deleted next sync', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const aRecordToMarkAsDeleted = (await dexiePerUserDataInstance.project_managements.toArray())[0]

  await dexiePerUserDataInstance.project_managements.put({
    ...aRecordToMarkAsDeleted,
    _deleted: true,
  })

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/management-regimes/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const pageSizeSelector = await screen.findByTestId('page-size-selector')

  await waitFor(() => expect(pageSizeSelector))
  await user.selectOptions(pageSizeSelector, '2')

  const rows = await screen.findAllByRole('row')

  expect(rows).toHaveLength(3)
})
