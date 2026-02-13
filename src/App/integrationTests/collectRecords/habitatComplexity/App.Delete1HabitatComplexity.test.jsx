import { describe, expect, test } from "vitest";
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
  test('Delete Habitat Complexity prompt confirm deletes the record with the proper UI response and messaging', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )
    const deleteButton = await screen.findByTestId('delete-record-button')

    await user.click(deleteButton)

    expect(screen.getByTestId('delete-record-prompt'))

    const modal = screen.getByTestId('delete-record-modal')

    await user.click(within(modal).getByTestId('delete-record-confirm-button'))

    // navigated to collect records table page
    expect(await screen.findByTestId('collecting-title'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '20')

    const table = screen.getByRole('table')

    const linkToHabitatComplexityRecord = within(table).queryByRole('link', {
      name: 'protocol_titles.habitatcomplexity',
    })

    expect(linkToHabitatComplexityRecord).not.toBeInTheDocument()
  })
})
