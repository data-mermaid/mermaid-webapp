import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

const ACROPORA_ID = 'acropora-0000-0000-0000-000000000000'

const renderBenthicPitRecord = async () => {
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

  return { user, dexiePerUserDataInstance }
}

const chooseBenthicAttribute = async (user, rowIndex, searchText, optionName) => {
  const attributeInput = screen.getAllByTestId('observation-benthic-attribute-input')[rowIndex]

  await user.clear(attributeInput)
  await user.type(attributeInput, searchText)
  await user.selectOptions(
    screen.getAllByRole('listbox')[rowIndex],
    screen.getByRole('option', { name: optionName }),
  )
}

describe('Benthic PIT bleaching', () => {
  test('an existing record opens with Include bleaching observations at No and no Bleaching column', async () => {
    await renderBenthicPitRecord()

    expect(await screen.findByTestId('include-bleaching-select')).toHaveDisplayValue('no')
    expect(screen.queryByTestId('bleaching-status-select')).not.toBeInTheDocument()
  })

  test('Yes shows the Bleaching column, coral rows take a status and the record saves it', async () => {
    const { user, dexiePerUserDataInstance } = await renderBenthicPitRecord()

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')

    // The three existing rows are Dead Coral with Algae, which is not coral
    const bleachingSelects = await screen.findAllByTestId('bleaching-status-select')

    expect(bleachingSelects).toHaveLength(3)
    bleachingSelects.forEach((select) => {
      expect(select).toBeDisabled()
      expect(select).toHaveDisplayValue('bleaching_status.na')
    })

    await user.click(screen.getByTestId('add-observation-row'))
    await chooseBenthicAttribute(user, 3, 'acro', 'Acropora')

    const newRowBleachingSelect = screen.getAllByTestId('bleaching-status-select')[3]

    expect(newRowBleachingSelect).toBeEnabled()
    expect(newRowBleachingSelect).toHaveDisplayValue('bleaching_status.normal')
    expect(
      within(newRowBleachingSelect).queryByRole('option', { name: 'bleaching_status.na' }),
    ).not.toBeInTheDocument()

    await user.selectOptions(newRowBleachingSelect, '1')
    expect(newRowBleachingSelect).toHaveDisplayValue('bleaching_status.pale')

    // Changing the attribute away from coral drops the status; back to coral restores Normal
    await chooseBenthicAttribute(user, 3, 'dead', 'Dead Coral with Algae')
    expect(screen.getAllByTestId('bleaching-status-select')[3]).toBeDisabled()
    await chooseBenthicAttribute(user, 3, 'acro', 'Acropora')
    expect(screen.getAllByTestId('bleaching-status-select')[3]).toHaveDisplayValue(
      'bleaching_status.normal',
    )

    await user.selectOptions(screen.getAllByTestId('bleaching-status-select')[3], '3')
    await user.click(screen.getByTestId('save-button'))
    expect(await screen.findByTestId('saved-button'))

    const savedRecord = (await dexiePerUserDataInstance.collect_records.toArray()).find(
      (record) => record.id === '50',
    )

    expect(savedRecord.data.include_bleaching).toBe(true)
    expect(
      savedRecord.data.obs_benthic_pits.map(({ bleaching_status }) => bleaching_status ?? null),
    ).toEqual([null, null, null, 3])
  })

  test('No hides the column and clears every status', async () => {
    const { user, dexiePerUserDataInstance } = await renderBenthicPitRecord()

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')
    await user.click(screen.getByTestId('add-observation-row'))
    await chooseBenthicAttribute(user, 3, 'acro', 'Acropora')
    await user.selectOptions(screen.getAllByTestId('bleaching-status-select')[3], '1')

    await user.selectOptions(screen.getByTestId('include-bleaching-select'), 'false')

    await waitFor(() =>
      expect(screen.queryByTestId('bleaching-status-select')).not.toBeInTheDocument(),
    )

    await user.click(screen.getByTestId('save-button'))
    expect(await screen.findByTestId('saved-button'))

    const savedRecord = (await dexiePerUserDataInstance.collect_records.toArray()).find(
      (record) => record.id === '50',
    )

    expect(savedRecord.data.include_bleaching).toBe(false)
    expect(savedRecord.data.obs_benthic_pits[3].bleaching_status).toBeNull()
  })

  test('an attribute proposed offline under a coral attribute takes a status', async () => {
    const { user, dexiePerUserDataInstance } = await renderBenthicPitRecord()

    await user.selectOptions(await screen.findByTestId('include-bleaching-select'), 'true')

    const firstAttributeInput = screen.getAllByTestId('observation-benthic-attribute-input')[0]

    await user.clear(firstAttributeInput)
    await user.type(firstAttributeInput, 'supercalifragilistic')
    await user.click(await screen.findByTestId('propose-new-benthic-attribute-button'))

    const modal = screen.getByTestId('attribute-proposal-modal')

    await user.type(await within(modal).findByTestId('attribute-label'), 'acro')
    await user.selectOptions(
      within(modal).getByRole('listbox'),
      within(modal).getByRole('option', { name: 'Acropora' }),
    )
    await user.type(within(modal).getByTestId('new-attribute-name'), 'unicorn')
    await user.click(within(modal).getByTestId('next-form-page'))
    await user.click(await within(modal).findByTestId('submit-proposal-button'))
    await waitForElementToBeRemoved(() => screen.queryByTestId('attribute-proposal-modal'))

    const proposedAttribute = (await dexiePerUserDataInstance.benthic_attributes.toArray()).find(
      ({ name }) => name === 'unicorn',
    )

    expect(proposedAttribute.top_level_category).toBe('hard-coral-category-0000-0000-000000000000')

    const firstRowBleachingSelect = screen.getAllByTestId('bleaching-status-select')[0]

    await waitFor(() => expect(firstRowBleachingSelect).toBeEnabled())
    expect(screen.getAllByTestId('bleaching-status-select')[0]).toHaveDisplayValue(
      'bleaching_status.normal',
    )
  })

  test('a record saved with bleaching reopens at Yes with its statuses', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const record = await dexiePerUserDataInstance.collect_records.get('50')

    await dexiePerUserDataInstance.collect_records.put({
      ...record,
      data: {
        ...record.data,
        include_bleaching: true,
        obs_benthic_pits: [
          ...record.data.obs_benthic_pits,
          { id: '4', interval: '6', attribute: ACROPORA_ID, growth_form: '', bleaching_status: 2 },
        ],
      },
    })

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    expect(await screen.findByTestId('include-bleaching-select')).toHaveDisplayValue('yes')

    const bleachingSelects = await screen.findAllByTestId('bleaching-status-select')

    expect(bleachingSelects[0]).toHaveDisplayValue('bleaching_status.na')
    expect(bleachingSelects[3]).toHaveDisplayValue('bleaching_status.partially_bleached')
  })
})
