import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOffline,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

// test suite cut up into 2 parts for performance reasons
describe('Offline', () => {
  test('Delete fishbelt prompt confirm deletes the record with the proper UI response and messaging', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    userEvent.click(await screen.findByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    const modal = screen.getByLabelText('Delete Record')

    userEvent.click(
      within(modal).getByText('Delete Record', {
        selector: 'button',
      }),
    )
    // shows toast
    expect(await screen.findByText('Record deleted.'))

    // navigated to collect records table page
    expect(
      await screen.findByText('Collecting', {
        selector: 'h2',
      }),
    )

    userEvent.selectOptions(screen.getByTestId('page-size-selector'), '50')

    const table = await screen.findByRole('table')

    const linksToFishbeltRecords = within(table).getAllByRole('link', { name: 'Fish Belt' })

    // row length = 15 because 16 mock records, now minus 1
    expect(linksToFishbeltRecords).toHaveLength(15)
  })
})
