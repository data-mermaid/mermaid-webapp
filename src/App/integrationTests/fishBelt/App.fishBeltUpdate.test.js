import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOffline,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../App'

describe('Offline', () => {
  test('Edit fishbelt save success shows toast message and proper record information', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
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
    expect(screen.getByDisplayValue('Site D'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes C'))
    expect(screen.getByLabelText('Depth')).toHaveValue(45)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-03-02')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(2)
    expect(screen.getByLabelText('Label')).toHaveValue('FB-2')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(6)
    expect(within(screen.getByTestId('width')).getByLabelText('2m')).toBeChecked()
    expect(within(screen.getByTestId('size_bin')).getByLabelText('5')).toBeChecked()
    expect(within(screen.getByTestId('reef_slope')).getByLabelText('flat')).toBeChecked()
    expect(within(screen.getByTestId('visibility')).getByLabelText('<1m - bad')).toBeChecked()
    expect(within(screen.getByTestId('current')).getByLabelText('high')).toBeChecked()
    expect(within(screen.getByTestId('relative_depth')).getByLabelText('deep')).toBeChecked()
    expect(within(screen.getByTestId('tide')).getByLabelText('high')).toBeChecked()

    expect(screen.getByLabelText('Notes')).toHaveValue('some fish notes')
  })
  test('Edit fishbelt save stores properly formatted fish belt observations in dexie', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
    })

    // test all observers format too
    const addObservationButton = await screen.findByRole('button', {
      name: 'Add Row',
    })

    userEvent.click(addObservationButton)

    const observationsTable = (await screen.findAllByRole('table'))[0]

    const observationRows = await within(observationsTable).findAllByRole('row')

    // 4 observations + 1 header row
    expect(observationRows.length).toEqual(5)

    const newFishNameInput = screen.getAllByLabelText('Fish Name')[3]
    // the first record technically has two size inputs (because its 50+), so this one is at index 4
    const newSizeInput = screen.getAllByLabelText('Size')[4]
    const newCountInput = screen.getAllByLabelText('Count')[3]

    userEvent.type(newFishNameInput, 'neb')

    const fishNameList = screen.getAllByRole('listbox')[3]

    const nebriusOption = screen.getByRole('option', {
      name: 'Nebrius',
    })

    userEvent.selectOptions(fishNameList, nebriusOption)

    userEvent.selectOptions(newSizeInput, '37.5')

    userEvent.type(newCountInput, '88')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))
    const savedCollectRecords = await dexieInstance.collect_records.toArray()

    const updatedCollectRecord = savedCollectRecords.filter((record) => record.id === '2')[0]

    const newObservation = updatedCollectRecord.data.obs_belt_fishes[3]

    expect(newObservation.fish_attribute).toEqual('018c6b47-9e6f-456d-8db2-ce1c91e8e1c4')
    expect(newObservation.count).toEqual(88)
    expect(newObservation.size).toEqual(37.5)
  })
  test('Edit fishbelt save stores properly formatted fish belt observations in dexie for 50+ observation size input', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
    })

    // test all observers format too
    const addObservationButton = await screen.findByRole('button', {
      name: 'Add Row',
    })

    userEvent.click(addObservationButton)

    const observationsTable = (await screen.findAllByRole('table'))[0]

    const observationRows = await within(observationsTable).findAllByRole('row')

    // 4 observations + 1 header row
    expect(observationRows.length).toEqual(5)

    // the first record technically has two size inputs (because its 50+), so this one is at index 4
    const newSizeInput = screen.getAllByLabelText('Size')[4]

    userEvent.selectOptions(newSizeInput, '50')

    const newSizePlus50Input = screen.getAllByLabelText('Size')[5]

    // we cant use userEvent.clear or {backspace} for whatever reason here. Maybe related to this issue https://github.com/testing-library/user-event/issues/356
    // so this typing is just appending to the existing '50' in the input.
    userEvent.type(newSizePlus50Input, '367')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))
    const savedCollectRecord = (await dexieInstance.collect_records.toArray()).find(
      (record) => record.id === '2',
    )

    const newObservation = savedCollectRecord.data.obs_belt_fishes[3]

    expect(newObservation.size).toEqual(50367)
  })
  test('Edit fishbelt save failure shows toast message with new edits persisting', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    // make sure the next save will fail
    dexieInstance.collect_records.put = jest.fn().mockRejectedValueOnce()

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
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

    expect(await screen.findByText('Something went wrong. The collect record has not been saved.'))

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })

  test('Edit fishbelt can "unselect" non required radio group inputs', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
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

    const editedStoredRecord = await dexieInstance.collect_records.get('2')

    const storedReefSlope = editedStoredRecord.data.fishbelt_transect.reef_slope
    const storedVisibility = editedStoredRecord.data.fishbelt_transect.visibility
    const storedCurrent = editedStoredRecord.data.fishbelt_transect.current
    const storedRelativeDepth = editedStoredRecord.data.fishbelt_transect.relative_depth
    const storedTide = editedStoredRecord.data.fishbelt_transect.tide

    // we store a non selection as an empty string because React doesnt like inputs changing type and the api interprets them as null
    expect(storedReefSlope).toEqual('')
    expect(storedVisibility).toEqual('')
    expect(storedCurrent).toEqual('')
    expect(storedRelativeDepth).toEqual('')
    expect(storedTide).toEqual('')
  })
})
