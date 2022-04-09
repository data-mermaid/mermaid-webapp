import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import { renderAuthenticatedOffline, screen } from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Collect page only shows records for the current user', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(
    <App dexieInstance={dexieInstance} />,
    {
      initialEntries: ['/projects/5/collecting/'],
    },
    dexieInstance,
  )

  userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '100')

  const rows = await screen.findAllByRole('row')

  // a record with a non current user was added to mock data.
  expect(rows).toHaveLength(17)
})

test('A user cannot navigate to a record they dont own', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(
    <App dexieInstance={dexieInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/100'],
    },
    dexieInstance,
  )

  expect(await screen.findByText("The item with the id 100 can't be found."))
})
