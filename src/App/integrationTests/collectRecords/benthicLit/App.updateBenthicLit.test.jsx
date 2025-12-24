import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

describe('Offline', () => {
  test('Edit Benthic LIT save success shows toast message and proper record information', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit/70'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    // make a change

    await user.clear(await screen.findByTestId('depth-input'))
    await user.type(screen.getByTestId('depth-input'), '45')

    await user.click(screen.getByTestId('save-button'))

    expect(screen.getByTestId('site-select')).toHaveDisplayValue('Site C')
    expect(screen.getByTestId('management-select')).toHaveDisplayValue(
      'Management Regimes C [Management Regimes 3]',
    )
    expect(screen.getByTestId('depth-input')).toHaveValue(45)
    expect(screen.getByTestId('sample-date-input')).toHaveValue('2020-04-19')
    expect(screen.getByTestId('sample-time-input')).toHaveValue('11:55')
    expect(screen.getByTestId('transect-number-input')).toHaveValue(5)
    expect(screen.getByTestId('label-input')).toHaveValue('FB-1')
    expect(screen.getByTestId('len-surveyed-input')).toHaveValue(10)
    expect(screen.getByTestId('reef-slope-select')).toHaveDisplayValue('flat')
    expect(screen.getByTestId('visibility-select')).toHaveDisplayValue('<1m - bad')
    expect(screen.getByTestId('current-select')).toHaveDisplayValue('moderate')
    expect(screen.getByTestId('relative-depth-select')).toHaveDisplayValue('deep')
    expect(screen.getByTestId('tide-select')).toHaveDisplayValue('high')
    expect(screen.getByTestId('notes-textarea')).toHaveValue('some fish notes')
  })

  test('Edit Benthic LIT save stores properly formatted Benthic LIT observations in dexie', async () => {
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

    // test all observers format too
    const addObservationButton = await screen.findByRole('button', {
      name: 'Add Row',
    })

    await user.click(addObservationButton)

    const observationsTable = await screen.findByLabelText('Observations')

    const observationRows = await within(observationsTable).findAllByRole('row')

    // 4 observations + 1 header row
    expect(observationRows.length).toEqual(5)

    const newBenthicAttributeInput = screen.getAllByLabelText('Benthic Attribute')[3]
    const newGrowthFromInput = screen.getAllByLabelText('Growth Form')[3]
    const newLengthInput = screen.getAllByLabelText('Length (cm)')[3]

    await user.type(newBenthicAttributeInput, 'dead')

    const benthicAttributeList = screen.getAllByRole('listbox')[3]

    const deadCoralOption = screen.getByRole('option', {
      name: 'Dead Coral with Algae',
    })

    await user.selectOptions(benthicAttributeList, deadCoralOption)

    await user.selectOptions(newGrowthFromInput, 'Columnar')

    await user.type(newLengthInput, '43')

    await user.click(screen.getByTestId('save-button'))

    const savedCollectRecords = await dexiePerUserDataInstance.collect_records.toArray()

    const updatedCollectRecord = savedCollectRecords.filter((record) => record.id === '70')[0]

    const newObservation = updatedCollectRecord.data.obs_benthic_lits[3]

    expect(newObservation.attribute).toEqual('fcf25ee3-701b-4d15-9a17-71f40406db4c')
    expect(newObservation.growth_form).toEqual('cbff6080-6387-44e5-b7ad-35f35f3db3a7')
    expect(newObservation.length).toEqual('43')
  })

  test('Edit Benthic LIT save failure shows toast message with new edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    // make sure the next save will fail
    dexiePerUserDataInstance.collect_records.put = jest.fn().mockRejectedValueOnce()

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit/70'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    // make an unsaved change
    const depthInput = await screen.findByTestId('depth-input')

    await user.clear(depthInput)
    await user.type(depthInput, '45')
    await user.click(screen.getByTestId('save-button'))

    expect(await screen.findByTestId('save-button'))

    expect(await screen.findByTestId('depth-input')).toHaveValue(45)
  })
})
