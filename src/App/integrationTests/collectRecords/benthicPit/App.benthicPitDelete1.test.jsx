import { describe, expect, test } from 'vitest'
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
    const deleteButton = await screen.findByTestId('delete-record-button')

    await user.click(deleteButton)

    expect(await screen.findByTestId('delete-record-prompt')).toBeInTheDocument()

    const modal = await screen.findByTestId('delete-record-modal')

    await user.click(within(modal).getByTestId('delete-record-confirm-button'))

    // navigated to collect records table page
    expect(await screen.findByTestId('collecting-title'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '20')

    const table = screen.getByRole('table')

    const linkToBenthicPitRecord = within(table).queryByRole('link', {
      name: 'protocol_titles.benthicpit',
    })

    expect(linkToBenthicPitRecord).not.toBeInTheDocument()
  })
})
