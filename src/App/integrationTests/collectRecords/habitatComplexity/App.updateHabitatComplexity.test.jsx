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
  test('Edit Habitat Complexity save success shows toast message and proper record information', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    // make sure there is a collect record to edit in dexie
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    // make a change

    await user.clear(await screen.findByLabelText('Depth'))
    await user.type(screen.getByLabelText('Depth'), '45')

    await user.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))

    expect(screen.getByLabelText('Site')).toHaveDisplayValue('Site C')
    expect(screen.getByLabelText('Management')).toHaveDisplayValue(
      'Management Regimes C [Management Regimes 3]',
    )
    expect(screen.getByLabelText('Depth')).toHaveValue(45)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2020-04-19')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(5)
    expect(screen.getByLabelText('Label')).toHaveValue('FB-1')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(10)
    expect(screen.getByLabelText('Interval Size')).toHaveValue(2)
    expect(screen.getByLabelText('Reef Slope')).toHaveDisplayValue('flat')
    expect(screen.getByLabelText('Visibility')).toHaveDisplayValue('<1m - bad')
    expect(screen.getByLabelText('Current')).toHaveDisplayValue('moderate')
    expect(screen.getByLabelText('Relative Depth')).toHaveDisplayValue('deep')
    expect(screen.getByLabelText('Tide')).toHaveDisplayValue('high')
    expect(screen.getByLabelText('Notes')).toHaveValue('some fish notes')
  })

  test('Edit Habitat Complexity save stores properly formatted Habitat Complexity observations in dexie', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
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

    const newHabitatComplexityScoreInput = screen.getAllByLabelText('Habitat Complexity Score')[3]

    await user.selectOptions(
      newHabitatComplexityScoreInput,
      '3 widespread moderately complex (30-60cm) relief',
    )

    await user.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Record saved.'))
    const savedCollectRecords = await dexiePerUserDataInstance.collect_records.toArray()

    const updatedCollectRecord = savedCollectRecords.filter((record) => record.id === '80')[0]

    const newObservation = updatedCollectRecord.data.obs_habitat_complexities[3]

    expect(newObservation.score).toEqual('1dda77b4-0e00-47ae-8b46-063bc7aed349')
    expect(newObservation.interval).toEqual(7)
  })

  test('Edit Habitat Complexity save failure shows toast message with new edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    // make sure the next save will fail
    dexiePerUserDataInstance.collect_records.put = jest.fn().mockRejectedValueOnce()

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    // make an unsaved change
    const depthInput = await screen.findByLabelText('Depth')

    await user.clear(depthInput)
    await user.type(depthInput, '45')
    await user.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('The sample unit has not been saved.'))

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })
})
