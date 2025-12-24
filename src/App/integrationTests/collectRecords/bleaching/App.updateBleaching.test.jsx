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
  test('Edit Bleaching collect record save success shows toast message and proper record information', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/bleachingqc/60'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    // make a change

    await user.clear(await screen.findByLabelText('Depth'))
    await user.type(screen.getByLabelText('Depth'), '45')

    await user.click(screen.getByTestId('save-button'))

    expect(await screen.findByTestId('saved-button'))

    // Site select
    expect(screen.getByDisplayValue('Site C'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes C [Management Regimes 3]'))
    expect(screen.getByTestId('depth-input')).toHaveValue(45)
    expect(screen.getByTestId('sample-date-input')).toHaveValue('2020-04-19')
    expect(screen.getByTestId('sample-time-input')).toHaveValue('11:55')
    expect(screen.getByTestId('label-input')).toHaveValue('FB-1')
    expect(screen.getByTestId('quadrat-size-input')).toHaveValue(10)
    // Visibility select on <1m - bad
    expect(screen.getByDisplayValue('<1m - bad'))
    // Current select on moderate
    expect(screen.getByDisplayValue('moderate'))
    // Relative Depth select on deep
    expect(screen.getByDisplayValue('deep'))
    // Tide select on high
    expect(screen.getByDisplayValue('high'))

    expect(screen.getByTestId('notes-textarea')).toHaveValue('some fish notes')
  })
  test('Edit Bleaching collect record save stores properly formatted Bleaching collect record colonies bleached observations in dexie', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/bleachingqc/60'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    const addObservationButton = (
      await screen.findAllByRole('button', {
        name: 'Add Row',
      })
    )[0]

    await user.click(addObservationButton)

    const coloniesBleachedObservationTable = await screen.findByLabelText(
      'Observations - Colonies Bleached',
    )

    const observationRows = await within(coloniesBleachedObservationTable).findAllByRole('row')

    // 4 observations + 2 header rows
    expect(observationRows.length).toEqual(6)

    const newBenthicAttributeInput = screen.getAllByLabelText('Benthic Attribute')[3]
    const newGrowthFromInput = screen.getAllByLabelText('Growth Form')[3]
    const newNormalInput = screen.getAllByLabelText('Normal')[3]
    const newPaleInput = screen.getAllByLabelText('Pale')[3]
    const new20BleachedInput = screen.getAllByLabelText('0-20% bleached')[3]
    const new50BleachedInput = screen.getAllByLabelText('20-50% bleached')[3]
    const new80BleachedInput = screen.getAllByLabelText('50-80% bleached')[3]
    const new100BleachedInput = screen.getAllByLabelText('80-100% bleached')[3]
    const newRecentlyDeadInput = screen.getAllByLabelText('Recently dead')[3]

    await user.type(newBenthicAttributeInput, 'dead')

    const benthicAttributeList = screen.getAllByRole('listbox')[3]

    const deadCoralOption = screen.getByRole('option', {
      name: 'Dead Coral with Algae',
    })

    await user.selectOptions(benthicAttributeList, deadCoralOption)

    await user.selectOptions(newGrowthFromInput, 'Columnar')

    await user.clear(newNormalInput)
    await user.clear(newPaleInput)
    await user.clear(new20BleachedInput)
    await user.clear(new50BleachedInput)
    await user.clear(new80BleachedInput)
    await user.clear(new100BleachedInput)
    await user.clear(newRecentlyDeadInput)

    await user.type(newNormalInput, '1')
    await user.type(newPaleInput, '1')
    await user.type(new20BleachedInput, '1')
    await user.type(new50BleachedInput, '1')
    await user.type(new80BleachedInput, '1')
    await user.type(new100BleachedInput, '1')
    await user.type(newRecentlyDeadInput, '1')

    await user.click(screen.getByTestId('save-button'))

    expect(await screen.findByTestId('saved-button'))
    const savedCollectRecords = await dexiePerUserDataInstance.collect_records.toArray()

    const updatedCollectRecord = savedCollectRecords.filter((record) => record.id === '60')[0]

    const newObservation = updatedCollectRecord.data.obs_colonies_bleached[3]

    expect(newObservation.attribute).toEqual('fcf25ee3-701b-4d15-9a17-71f40406db4c')
    expect(newObservation.growth_form).toEqual('cbff6080-6387-44e5-b7ad-35f35f3db3a7')
    expect(newObservation.count_dead).toEqual('1')
    expect(newObservation.count_normal).toEqual('1')
    expect(newObservation.count_pale).toEqual('1')
    expect(newObservation.count_20).toEqual('1')
    expect(newObservation.count_50).toEqual('1')
    expect(newObservation.count_80).toEqual('1')
    expect(newObservation.count_100).toEqual('1')
  })
  test('Edit Bleaching collect record save stores properly formatted Bleaching percent observations in dexie', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/bleachingqc/60'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    const addObservationButton = (
      await screen.findAllByRole('button', {
        name: 'Add Row',
      })
    )[1]

    await user.click(addObservationButton)

    const percentCoverObservationsTable = (await screen.findAllByRole('table'))[1]

    const observationRows = await within(percentCoverObservationsTable).findAllByRole('row')

    // 4 observations + 1 header row
    expect(observationRows.length).toEqual(5)

    const newHardCoralInput = screen.getAllByLabelText('Hard coral % cover')[3]
    const newSoftCoralInput = screen.getAllByLabelText('Soft coral % cover')[3]
    const newMacroalgaeInput = screen.getAllByLabelText('Macroalgae % cover')[3]

    await user.type(newHardCoralInput, '8')
    await user.type(newSoftCoralInput, '8')
    await user.type(newMacroalgaeInput, '8')

    await user.click(screen.getByTestId('save-button'))

    expect(await screen.findByTestId('saved-button'))
    const savedCollectRecords = await dexiePerUserDataInstance.collect_records.toArray()

    const updatedCollectRecord = savedCollectRecords.filter((record) => record.id === '60')[0]

    const newObservation = updatedCollectRecord.data.obs_quadrat_benthic_percent[3]

    expect(newObservation.percent_algae).toEqual('8')
    expect(newObservation.percent_hard).toEqual('8')
    expect(newObservation.percent_soft).toEqual('8')
    expect(newObservation.quadrat_number).toEqual(4) // quadrat numner is autogenerated, so a number not a string from an input
  })
  test('Edit Bleaching collect record save failure shows toast message with new edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    // make sure the next save will fail
    dexiePerUserDataInstance.collect_records.put = jest.fn().mockRejectedValueOnce()

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/bleachingqc/60'],
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
