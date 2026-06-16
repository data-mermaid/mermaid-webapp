import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { mockT } from '../../../../testUtilities/mockT'

import {
  screen,
  renderAuthenticatedOffline,
  within,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import mockBeltInvertCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBeltInvertCollectRecords'
import App from '../../../App'

// test suite cut up into 2 parts for performance reasons
describe('Offline', () => {
  test('Delete macroinvertebrate prompt confirm deletes the record with the proper UI response and messaging', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)
    await dexiePerUserDataInstance.collect_records.bulkPut(mockBeltInvertCollectRecords)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-2'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await user.click(await screen.findByTestId('delete-record-button'))

    expect(screen.getByTestId('delete-record-prompt'))

    const modal = screen.getByTestId('delete-record-modal')

    await user.click(within(modal).getByTestId('delete-record-confirm-button'))

    // navigated to collect records table page
    expect(await screen.findByTestId('collecting-title'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '22')

    const table = await screen.findByRole('table')

    const linksToBeltInvertRecords = within(table).getAllByRole('link', {
      name: 'protocol_titles.macroinvertebrate',
    })

    // row length = 1 because there were 2 mock records, now minus 1
    expect(linksToBeltInvertRecords).toHaveLength(1)
    expect(mockT).toHaveBeenCalledWith('protocol_titles.macroinvertebrate')
  })
})
