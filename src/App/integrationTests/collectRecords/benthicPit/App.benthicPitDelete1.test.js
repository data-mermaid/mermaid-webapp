import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  within,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

// test suite cut up into 2 parts for performance reasons
describe('Offline', () => {
  test('Delete benthic PIT prompt confirm deletes the record with the proper UI response and messaging', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthicpit/50'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )
    const deleteButton = await screen.findByText('Delete Record')

    await user.click(deleteButton)

    expect(screen.getByText('Are you sure you want to delete this record?'))

    const modal = screen.getByLabelText('Delete Record')

    await user.click(
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

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '20')

    const table = screen.getByRole('table')

    const linkToBenthicPitRecord = within(table).queryByRole('link', { name: 'Benthic PIT' })

    expect(linkToBenthicPitRecord).not.toBeInTheDocument()
  })
})
