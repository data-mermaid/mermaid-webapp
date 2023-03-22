import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOffline,
  waitForElementToBeRemoved,
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

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    // make a change

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))

    // Site select
    expect(screen.getByDisplayValue('Site C'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes C [Management Regimes 3]'))
    expect(screen.getByLabelText('Depth')).toHaveValue(45)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2020-04-19')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
    expect(screen.getByLabelText('Label')).toHaveValue('FB-1')
    expect(screen.getByLabelText('Quadrat Size')).toHaveValue(10)
    expect(within(screen.getByTestId('visibility')).getByLabelText('<1m - bad')).toBeChecked()
    expect(within(screen.getByTestId('current')).getByLabelText('high')).toBeChecked()
    expect(within(screen.getByTestId('relative_depth')).getByLabelText('deep')).toBeChecked()
    expect(within(screen.getByTestId('tide')).getByLabelText('high')).toBeChecked()

    expect(screen.getByLabelText('Notes')).toHaveValue('some fish notes')
  })
  test('Edit Bleaching collect record save stores properly formatted Bleaching collect record colonies bleached observations in dexie', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    const addObservationButton = (
      await screen.findAllByRole('button', {
        name: 'Add Row',
      })
    )[0]

    userEvent.click(addObservationButton)

    const coloniesBleachedObservationTable = screen.getByLabelText(
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

    userEvent.type(newBenthicAttributeInput, 'dead')

    const benthicAttributeList = screen.getAllByRole('listbox')[3]

    const deadCoralOption = screen.getByRole('option', {
      name: 'Dead Coral with Algae',
    })

    userEvent.selectOptions(benthicAttributeList, deadCoralOption)

    userEvent.selectOptions(newGrowthFromInput, 'Columnar')

    userEvent.clear(newNormalInput)
    userEvent.clear(newPaleInput)
    userEvent.clear(new20BleachedInput)
    userEvent.clear(new50BleachedInput)
    userEvent.clear(new80BleachedInput)
    userEvent.clear(new100BleachedInput)
    userEvent.clear(newRecentlyDeadInput)

    userEvent.type(newNormalInput, '1')
    userEvent.type(newPaleInput, '1')
    userEvent.type(new20BleachedInput, '1')
    userEvent.type(new50BleachedInput, '1')
    userEvent.type(new80BleachedInput, '1')
    userEvent.type(new100BleachedInput, '1')
    userEvent.type(newRecentlyDeadInput, '1')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))
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

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    const addObservationButton = (
      await screen.findAllByRole('button', {
        name: 'Add Row',
      })
    )[1]

    userEvent.click(addObservationButton)

    const percentCoverObservationsTable = (await screen.findAllByRole('table'))[1]

    const observationRows = await within(percentCoverObservationsTable).findAllByRole('row')

    // 4 observations + 1 header row
    expect(observationRows.length).toEqual(5)

    const newHardCoralInput = screen.getAllByLabelText('Hard coral % cover')[3]
    const newSoftCoralInput = screen.getAllByLabelText('Soft coral % cover')[3]
    const newMicroalgaeInput = screen.getAllByLabelText('Microalgae % cover')[3]

    userEvent.type(newHardCoralInput, '8')
    userEvent.type(newSoftCoralInput, '8')
    userEvent.type(newMicroalgaeInput, '8')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))
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

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    // make an unsaved change
    const depthInput = await screen.findByLabelText('Depth')

    userEvent.clear(depthInput)
    userEvent.type(depthInput, '45')
    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('The sample unit has not been saved.'))

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })

  test('Edit Bleaching collect record can "unselect" non required radio group inputs', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await screen.findByLabelText('project pages loading indicator')
    await waitForElementToBeRemoved(() =>
      screen.queryByLabelText('project pages loading indicator'),
    )

    expect(within(screen.getByTestId('visibility')).getByLabelText('<1m - bad')).toBeChecked()
    expect(within(screen.getByTestId('current')).getByLabelText('high')).toBeChecked()
    expect(within(screen.getByTestId('relative_depth')).getByLabelText('deep')).toBeChecked()
    expect(within(screen.getByTestId('tide')).getByLabelText('high')).toBeChecked()

    userEvent.click(within(screen.getByTestId('visibility')).getByLabelText('not reported'))
    userEvent.click(within(screen.getByTestId('current')).getByLabelText('not reported'))
    userEvent.click(within(screen.getByTestId('relative_depth')).getByLabelText('not reported'))
    userEvent.click(within(screen.getByTestId('tide')).getByLabelText('not reported'))

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))

    const editedStoredRecord = await dexiePerUserDataInstance.collect_records.get('60')

    const storedVisibility = editedStoredRecord.data.quadrat_collection.visibility
    const storedCurrent = editedStoredRecord.data.quadrat_collection.current
    const storedRelativeDepth = editedStoredRecord.data.quadrat_collection.relative_depth
    const storedTide = editedStoredRecord.data.quadrat_collection.tide

    // we store a non selection as an empty string because React doesnt like inputs changing type and the api interprets them as null
    expect(storedVisibility).toEqual('')
    expect(storedCurrent).toEqual('')
    expect(storedRelativeDepth).toEqual('')
    expect(storedTide).toEqual('')
  })
})
