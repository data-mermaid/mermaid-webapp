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
  test('Edit Benthic LIT save success shows toast message and proper record information', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
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
    expect(screen.getByDisplayValue('Management Regimes C'))
    expect(screen.getByLabelText('Depth')).toHaveValue(45)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2020-04-19')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(5)
    expect(screen.getByLabelText('Label')).toHaveValue('FB-1')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(10)
    expect(within(screen.getByTestId('reef_slope')).getByLabelText('flat')).toBeChecked()
    expect(within(screen.getByTestId('visibility')).getByLabelText('<1m - bad')).toBeChecked()
    expect(within(screen.getByTestId('current')).getByLabelText('high')).toBeChecked()
    expect(within(screen.getByTestId('relative_depth')).getByLabelText('deep')).toBeChecked()
    expect(within(screen.getByTestId('tide')).getByLabelText('high')).toBeChecked()

    expect(screen.getByLabelText('Notes')).toHaveValue('some fish notes')
  })
  test('Edit Benthic LIT save stores properly formatted Benthic LIT observations in dexie', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    // test all observers format too
    const addObservationButton = await screen.findByRole('button', {
      name: 'Add Row',
    })

    userEvent.click(addObservationButton)

    const observationsTable = await screen.findByLabelText('Observations')

    const observationRows = await within(observationsTable).findAllByRole('row')

    // 4 observations + 1 header row
    expect(observationRows.length).toEqual(5)

    const newBenthicAttributeInput = screen.getAllByLabelText('Benthic Attribute')[3]
    const newGrowthFromInput = screen.getAllByLabelText('Growth Form')[3]
    const newLengthInput = screen.getAllByLabelText('Length')[3]

    userEvent.type(newBenthicAttributeInput, 'dead')

    const benthicAttributeList = screen.getAllByRole('listbox')[3]

    const deadCoralOption = screen.getByRole('option', {
      name: 'Dead Coral with Algae',
    })

    userEvent.selectOptions(benthicAttributeList, deadCoralOption)

    userEvent.selectOptions(newGrowthFromInput, 'Columnar')

    userEvent.type(newLengthInput, '43')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))
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

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
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

    expect(await screen.findByText('Something went wrong. The sample unit has not been saved.'))

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })

  test('Edit Benthic LIT can "unselect" non required radio group inputs', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await screen.findByLabelText('project pages loading indicator')
    await waitForElementToBeRemoved(() =>
      screen.queryByLabelText('project pages loading indicator'),
    )

    expect(within(screen.getByTestId('reef_slope')).getByLabelText('flat')).toBeChecked()
    expect(within(screen.getByTestId('visibility')).getByLabelText('<1m - bad')).toBeChecked()
    expect(within(screen.getByTestId('current')).getByLabelText('high')).toBeChecked()
    expect(within(screen.getByTestId('relative_depth')).getByLabelText('deep')).toBeChecked()
    expect(within(screen.getByTestId('tide')).getByLabelText('high')).toBeChecked()

    userEvent.click(within(screen.getByTestId('reef_slope')).getByLabelText('not reported'))
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

    const editedStoredRecord = await dexiePerUserDataInstance.collect_records.get('70')

    const storedReefSlope = editedStoredRecord.data.benthic_transect.reef_slope
    const storedVisibility = editedStoredRecord.data.benthic_transect.visibility
    const storedCurrent = editedStoredRecord.data.benthic_transect.current
    const storedRelativeDepth = editedStoredRecord.data.benthic_transect.relative_depth
    const storedTide = editedStoredRecord.data.benthic_transect.tide

    // we store a non selection as an empty string because React doesnt like inputs changing type and the api interprets them as null
    expect(storedReefSlope).toEqual('')
    expect(storedVisibility).toEqual('')
    expect(storedCurrent).toEqual('')
    expect(storedRelativeDepth).toEqual('')
    expect(storedTide).toEqual('')
  })
})
