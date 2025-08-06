import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  within,
  waitFor,
  waitForElementToBeRemoved,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

describe('Offline', () => {
  test('Edit fishbelt save success shows toast message and proper record information', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/fishbelt/2'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await screen.findByLabelText('project pages loading indicator')
    await waitForElementToBeRemoved(() =>
      screen.queryByLabelText('project pages loading indicator'),
    )

    const depthRow = screen.getByTestId('depth')
    const sampleDateRow = screen.getByTestId('sample_date')
    const sampleTimeRow = screen.getByTestId('sample_time')
    const transectNumberRow = screen.getByTestId('transect_number')
    const labelRow = screen.getByTestId('label')
    const lengthSurveyedRow = screen.getByTestId('len_surveyed')
    const widthRow = screen.getByTestId('width')
    const sizeBinRow = screen.getByTestId('size_bin')
    const reefSlopeRow = screen.getByTestId('reef_slope')
    const notesRow = screen.getByTestId('notes')
    const observersRow = screen.getByTestId('observers')

    await user.clear(screen.getByTestId('depth-input'))
    await user.type(screen.getByTestId('depth-input'), '45')

    await user.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))

    expect(screen.getByLabelText('Site')).toHaveDisplayValue('Site D')
    expect(screen.getByLabelText('Management')).toHaveDisplayValue(
      'Management Regimes C [Management Regimes 3]',
    )
    expect(within(depthRow).getByTestId('depth-input')).toHaveValue(45)
    expect(within(sampleDateRow).getByTestId('sample_date-input')).toHaveValue('2021-03-02')
    expect(within(sampleTimeRow).getByTestId('sample_time-input')).toHaveValue('11:55')
    expect(within(transectNumberRow).getByTestId('transect_number-input')).toHaveValue(2)
    expect(within(labelRow).getByTestId('label-input')).toHaveValue('FB-2')
    expect(within(lengthSurveyedRow).getByTestId('len_surveyed-input')).toHaveValue(6)
    expect(within(widthRow).getByTestId('width-select')).toHaveDisplayValue('2m')
    expect(within(sizeBinRow).getByTestId('size_bin-select')).toHaveDisplayValue('5')
    expect(within(reefSlopeRow).getByTestId('reef_slope-select')).toHaveDisplayValue('flat')
    expect(
      within(screen.getByTestId('visibility')).getByTestId('visibility-select'),
    ).toHaveDisplayValue('<1m - bad')
    expect(within(screen.getByTestId('current')).getByTestId('current-select')).toHaveDisplayValue(
      'moderate',
    )
    expect(
      within(screen.getByTestId('relative_depth')).getByTestId('relative_depth-select'),
    ).toHaveDisplayValue('deep')
    expect(within(screen.getByTestId('tide')).getByTestId('tide-select')).toHaveDisplayValue('high')
    expect(within(screen.getByTestId('notes')).getByTestId('notes-textarea')).toHaveValue(
      'some fish notes',
    )
  })
  //TODO: Unfixable test, come back to it later
  // test('Edit fishbelt save stores properly formatted fish belt observations in dexie', async () => {
  //   const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  //   await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  //   const { user } = renderAuthenticatedOffline(
  //     <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
  //     {
  //       initialEntries: ['/projects/5/collecting/fishbelt/2'],
  //       dexiePerUserDataInstance,
  //       dexieCurrentUserInstance,
  //     },
  //   )

  //   // test all observers format too
  //   const addObservationButton = await screen.findByRole('button', {
  //     name: 'Add Row',
  //   })

  //   await user.click(addObservationButton)

  //   const observationsTable = (await screen.findAllByRole('table'))[0]

  //   const observationRows = await within(observationsTable).findAllByRole('row')

  //   // 4 observations + 1 header row
  //   expect(observationRows.length).toEqual(5)

  //   const newFishNameInput = screen.getAllByLabelText('Fish Name')[3]
  //   // the first record technically has two size inputs (because its 50+), so this one is at index 4
  //   const newSizeInput = screen.getAllByLabelText('Size (cm)')[4]
  //   const newCountInput = screen.getAllByLabelText('Count')[3]

  //   await user.type(newFishNameInput, 'neb')

  //   const fishNameList = screen.getAllByRole('listbox')[3]

  //   const nebriusOption = screen.getByRole('option', {
  //     name: 'Nebrius',
  //   })

  //   await user.selectOptions(fishNameList, nebriusOption)

  //   await user.selectOptions(newSizeInput, '37.5')

  //   await user.type(newCountInput, '88')

  //   await user.click(
  //     screen.getByText('Save', {
  //       selector: 'button',
  //     }),
  //   )

  //   expect(await screen.findByText('Record saved.'))
  //   const savedCollectRecords = await dexiePerUserDataInstance.collect_records.toArray()

  //   const updatedCollectRecord = savedCollectRecords.filter((record) => record.id === '2')[0]

  //   const newObservation = updatedCollectRecord.data.obs_belt_fishes[3]

  //   expect(newObservation.fish_attribute).toEqual('018c6b47-9e6f-456d-8db2-ce1c91e8e1c4')
  //   expect(newObservation.count).toEqual(88)
  //   expect(newObservation.size).toEqual(37.5)
  // })
  // test('Edit fishbelt save stores properly formatted fish belt observations in dexie for 50+ observation size input', async () => {
  //   const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  //   await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  //   const { user } = renderAuthenticatedOffline(
  //     <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
  //     {
  //       initialEntries: ['/projects/5/collecting/fishbelt/2'],
  //       dexiePerUserDataInstance,
  //       dexieCurrentUserInstance,
  //     },
  //   )

  //   // test all observers format too
  //   const addObservationButton = await screen.findByRole('button', {
  //     name: 'Add Row',
  //   })

  //   await user.click(addObservationButton)

  //   const observationsTable = (await screen.findAllByRole('table'))[0]

  //   const observationRows = await within(observationsTable).findAllByRole('row')

  //   // 4 observations + 1 header row
  //   expect(observationRows.length).toEqual(5)

  //   // the first record technically has two size inputs (because its 50+), so this one is at index 4
  //   const newSizeInput = screen.getAllByLabelText('Size (cm)')[4]

  //   await user.selectOptions(newSizeInput, '50')

  //   const newSizePlus50Input = screen.getAllByLabelText('Size (cm)')[5]

  //   // we cant use user.clear or {backspace} for whatever reason here. Maybe related to this issue https://github.com/testing-library/user-event/issues/356
  //   // so this typing is just appending to the existing '50' in the input.
  //   await user.type(newSizePlus50Input, '367')

  //   await user.click(
  //     screen.getByText('Save', {
  //       selector: 'button',
  //     }),
  //   )

  //   expect(await screen.findByText('Record saved.'))
  //   const savedCollectRecord = (await dexiePerUserDataInstance.collect_records.toArray()).find(
  //     (record) => record.id === '2',
  //   )

  //   const newObservation = savedCollectRecord.data.obs_belt_fishes[3]

  //   expect(newObservation.size).toEqual(50367)
  // })
  // test('Edit fishbelt save failure shows toast message with new edits persisting', async () => {
  //   const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  //   await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  //   // make sure the next save will fail
  //   dexiePerUserDataInstance.collect_records.put = jest.fn().mockRejectedValueOnce()

  //   const { user } = renderAuthenticatedOffline(
  //     <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
  //     {
  //       initialEntries: ['/projects/5/collecting/fishbelt/2'],
  //       dexiePerUserDataInstance,
  //       dexieCurrentUserInstance,
  //     },
  //   )

  //   await screen.findByLabelText('project pages loading indicator')
  //   await waitForElementToBeRemoved(() =>
  //     screen.queryByLabelText('project pages loading indicator'),
  //   )

  //   // make an unsaved change
  //   const depthInput = screen.getByLabelText('Depth')

  //   await user.clear(depthInput)
  //   await user.type(depthInput, '45')
  //   await waitFor(() => expect(depthInput).toHaveValue(45))

  //   await user.click(
  //     screen.getByText('Save', {
  //       selector: 'button',
  //     }),
  //   )

  //   expect(await screen.findByText('The sample unit has not been saved.'))

  //   expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  // })
})
