import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

const ACROPORA_ID = 'acropora-0000-0000-0000-000000000000'

const renderBenthicLitRecord = ({ dexiePerUserDataInstance, dexieCurrentUserInstance }) =>
  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthiclit/70'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

const getSavedRecord = async (dexiePerUserDataInstance) =>
  (await dexiePerUserDataInstance.collect_records.toArray()).find((record) => record.id === '70')

const addAcroporaRow = async (user) => {
  await user.click(screen.getByTestId('add-observation-row'))
  await user.type(screen.getAllByTestId('observation-benthic-attribute-input')[3], 'acro')
  await user.selectOptions(
    screen.getAllByRole('listbox')[3],
    screen.getByRole('option', { name: 'Acropora' }),
  )
  await user.type(screen.getAllByTestId('observation-length-input')[3], '10')
}

describe('Benthic LIT bleaching', () => {
  test('Yes shows the Bleaching column, coral rows take a status and the record saves it', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()
    const { dexiePerUserDataInstance } = dexieInstances

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderBenthicLitRecord(dexieInstances)

    expect(await screen.findByTestId('include-bleaching-select')).toHaveDisplayValue('no')
    expect(screen.queryByTestId('bleaching-status-select')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByTestId('include-bleaching-select'), 'true')

    // The three existing rows are Dead Coral with Algae, which is not coral
    expect(await screen.findAllByTestId('bleaching-status-select')).toHaveLength(3)
    expect(screen.getAllByTestId('bleaching-status-select')[0]).toBeDisabled()

    await addAcroporaRow(user)

    const newRowBleachingSelect = screen.getAllByTestId('bleaching-status-select')[3]

    expect(newRowBleachingSelect).toHaveDisplayValue('bleaching_status.normal')

    await user.selectOptions(newRowBleachingSelect, '4')
    await user.click(screen.getByTestId('save-button'))
    expect(await screen.findByTestId('saved-button'))

    const savedRecord = await getSavedRecord(dexiePerUserDataInstance)

    expect(savedRecord.data.include_bleaching).toBe(true)
    expect(
      savedRecord.data.obs_benthic_lits.map(({ bleaching_status }) => bleaching_status ?? null),
    ).toEqual([null, null, null, 4])
  })

  test('No hides the column and clears every status', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()
    const { dexiePerUserDataInstance } = dexieInstances

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderBenthicLitRecord(dexieInstances)

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')
    await addAcroporaRow(user)
    await user.selectOptions(screen.getAllByTestId('bleaching-status-select')[3], '1')

    await user.selectOptions(screen.getByTestId('include-bleaching-select'), 'false')

    await waitFor(() =>
      expect(screen.queryByTestId('bleaching-status-select')).not.toBeInTheDocument(),
    )

    await user.click(screen.getByTestId('save-button'))
    expect(await screen.findByTestId('saved-button'))

    const savedRecord = await getSavedRecord(dexiePerUserDataInstance)

    expect(savedRecord.data.include_bleaching).toBe(false)
    expect(savedRecord.data.obs_benthic_lits[3].bleaching_status).toBeNull()
  })

  test('a record saved with bleaching reopens at Yes with its statuses', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()
    const { dexiePerUserDataInstance } = dexieInstances

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const record = await dexiePerUserDataInstance.collect_records.get('70')

    await dexiePerUserDataInstance.collect_records.put({
      ...record,
      data: {
        ...record.data,
        include_bleaching: true,
        obs_benthic_lits: [
          ...record.data.obs_benthic_lits,
          { id: '4', length: '6', attribute: ACROPORA_ID, growth_form: '', bleaching_status: 2 },
        ],
      },
    })

    renderBenthicLitRecord(dexieInstances)

    expect(await screen.findByTestId('include-bleaching-select')).toHaveDisplayValue('yes')

    const bleachingSelects = await screen.findAllByTestId('bleaching-status-select')

    expect(bleachingSelects[0]).toHaveDisplayValue('bleaching_status.na')
    expect(bleachingSelects[3]).toHaveDisplayValue('bleaching_status.partially_bleached')
  })
})
