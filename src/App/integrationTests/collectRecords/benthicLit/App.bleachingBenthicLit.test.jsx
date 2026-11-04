import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

describe('Benthic LIT bleaching', () => {
  test('Yes shows the Bleaching column, coral rows take a status and the record saves it', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit/70'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    expect(await screen.findByTestId('include-bleaching-select')).toHaveDisplayValue('no')
    expect(screen.queryByTestId('bleaching-status-select')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByTestId('include-bleaching-select'), 'true')

    // The three existing rows are Dead Coral with Algae, which is not coral
    expect(await screen.findAllByTestId('bleaching-status-select')).toHaveLength(3)
    expect(screen.getAllByTestId('bleaching-status-select')[0]).toBeDisabled()

    await user.click(screen.getByTestId('add-observation-row'))
    await user.type(screen.getAllByTestId('observation-benthic-attribute-input')[3], 'acro')
    await user.selectOptions(
      screen.getAllByRole('listbox')[3],
      screen.getByRole('option', { name: 'Acropora' }),
    )

    const newRowBleachingSelect = screen.getAllByTestId('bleaching-status-select')[3]

    expect(newRowBleachingSelect).toHaveDisplayValue('bleaching_status.normal')

    await user.selectOptions(newRowBleachingSelect, '4')
    await user.type(screen.getAllByTestId('observation-length-input')[3], '10')
    await user.click(screen.getByTestId('save-button'))
    expect(await screen.findByTestId('saved-button'))

    const savedRecord = (await dexiePerUserDataInstance.collect_records.toArray()).find(
      (record) => record.id === '70',
    )

    expect(savedRecord.data.include_bleaching).toBe(true)
    expect(
      savedRecord.data.obs_benthic_lits.map(({ bleaching_status }) => bleaching_status ?? null),
    ).toEqual([null, null, null, 4])
  })
})
