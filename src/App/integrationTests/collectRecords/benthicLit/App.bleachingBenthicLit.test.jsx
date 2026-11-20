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

  test('Confirming No hides the column and clears every status', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()
    const { dexiePerUserDataInstance } = dexieInstances

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderBenthicLitRecord(dexieInstances)

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')
    await addAcroporaRow(user)
    await user.selectOptions(screen.getAllByTestId('bleaching-status-select')[3], '1')

    await user.selectOptions(screen.getByTestId('include-bleaching-select'), 'false')
    await user.click(await screen.findByTestId('turn-off-bleaching-confirm'))

    await waitFor(() =>
      expect(screen.queryByTestId('bleaching-status-select')).not.toBeInTheDocument(),
    )
    expect(screen.queryByTestId('turn-off-bleaching-modal')).not.toBeInTheDocument()
    expect(screen.getByTestId('include-bleaching-select')).toHaveDisplayValue('no')

    await user.click(screen.getByTestId('save-button'))
    expect(await screen.findByTestId('saved-button'))

    const savedRecord = await getSavedRecord(dexiePerUserDataInstance)

    expect(savedRecord.data.include_bleaching).toBe(false)
    expect(savedRecord.data.obs_benthic_lits[3].bleaching_status).toBeNull()
  })

  test('NA on a coral row stays through other edits and an attribute change between corals, and saves as no status', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()
    const { dexiePerUserDataInstance } = dexieInstances

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderBenthicLitRecord(dexieInstances)

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')
    await addAcroporaRow(user)

    const getNewRowBleachingSelect = () => screen.getAllByTestId('bleaching-status-select')[3]

    await user.selectOptions(getNewRowBleachingSelect(), '')
    expect(getNewRowBleachingSelect()).toHaveDisplayValue('bleaching_status.na')

    await user.selectOptions(screen.getAllByTestId('growth-form-select')[0], 'Columnar')
    expect(getNewRowBleachingSelect()).toHaveDisplayValue('bleaching_status.na')

    const attributeInput = screen.getAllByTestId('observation-benthic-attribute-input')[3]

    await user.clear(attributeInput)
    await user.type(attributeInput, 'hard')
    await user.selectOptions(
      screen.getAllByRole('listbox')[3],
      screen.getByRole('option', { name: 'Hard coral' }),
    )
    expect(getNewRowBleachingSelect()).toHaveDisplayValue('bleaching_status.na')

    await user.click(screen.getByTestId('save-button'))
    expect(await screen.findByTestId('saved-button'))

    const savedRecord = await getSavedRecord(dexiePerUserDataInstance)

    expect(savedRecord.data.obs_benthic_lits[3].attribute).toBe(
      'hard-coral-category-0000-0000-000000000000',
    )
    expect(savedRecord.data.obs_benthic_lits[3].bleaching_status).toBeNull()
  })

  test('Tab from the last Bleaching cell adds a coral row at Normal', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()
    const { dexiePerUserDataInstance } = dexieInstances

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderBenthicLitRecord(dexieInstances)

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')
    await addAcroporaRow(user)

    const lastBleachingSelect = screen.getAllByTestId('bleaching-status-select')[3]

    await user.selectOptions(lastBleachingSelect, '1')
    lastBleachingSelect.focus()
    await user.tab()

    const bleachingSelects = screen.getAllByTestId('bleaching-status-select')

    expect(bleachingSelects).toHaveLength(5)
    expect(bleachingSelects[3]).toHaveDisplayValue('bleaching_status.pale')
    expect(bleachingSelects[4]).toHaveDisplayValue('bleaching_status.normal')
  })

  test('the summary shows the bleached share of hard coral as statuses change', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstances.dexiePerUserDataInstance)

    const { user } = renderBenthicLitRecord(dexieInstances)

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')
    await addAcroporaRow(user)

    expect(screen.getByRole('row', { name: '% bleaching_status.pale 0.0' })).toBeInTheDocument()

    await user.selectOptions(screen.getAllByTestId('bleaching-status-select')[3], '1')

    expect(screen.getByRole('row', { name: '% bleaching_status.pale 100.0' })).toBeInTheDocument()
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
          { id: '5', length: '7', attribute: ACROPORA_ID, growth_form: '', bleaching_status: null },
        ],
      },
    })

    renderBenthicLitRecord(dexieInstances)

    expect(await screen.findByTestId('include-bleaching-select')).toHaveDisplayValue('yes')

    const bleachingSelects = await screen.findAllByTestId('bleaching-status-select')

    expect(bleachingSelects[0]).toHaveDisplayValue('bleaching_status.na')
    expect(bleachingSelects[3]).toHaveDisplayValue('bleaching_status.partially_bleached')
    // Reopening must not fill a coral row's NA with Normal
    expect(bleachingSelects[4]).toHaveDisplayValue('bleaching_status.na')
  })

  test('a coral attribute another user proposed still takes a status', async () => {
    const dexieInstances = getMockDexieInstancesAllSuccess()
    const { dexiePerUserDataInstance } = dexieInstances

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const acropora = await dexiePerUserDataInstance.benthic_attributes.get(ACROPORA_ID)

    // Status 10 from another profile: left out of the attribute picker, still coral
    await dexiePerUserDataInstance.benthic_attributes.put({
      ...acropora,
      id: 'proposed-by-another-user',
      name: 'Acropora proposed by another user',
      parent: ACROPORA_ID,
      status: 10,
      created_by: 'another-profile',
    })

    const record = await dexiePerUserDataInstance.collect_records.get('70')

    await dexiePerUserDataInstance.collect_records.put({
      ...record,
      data: {
        ...record.data,
        include_bleaching: true,
        obs_benthic_lits: [
          ...record.data.obs_benthic_lits,
          {
            id: '4',
            length: '6',
            attribute: 'proposed-by-another-user',
            growth_form: '',
            bleaching_status: 1,
          },
        ],
      },
    })

    renderBenthicLitRecord(dexieInstances)

    const bleachingSelects = await screen.findAllByTestId('bleaching-status-select')

    expect(bleachingSelects[3]).toBeEnabled()
    expect(bleachingSelects[3]).toHaveDisplayValue('bleaching_status.pale')
  })
})
