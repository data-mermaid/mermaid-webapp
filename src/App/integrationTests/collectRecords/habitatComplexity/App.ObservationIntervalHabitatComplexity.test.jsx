import '@testing-library/jest-dom'
import React from 'react'

import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import App from '../../../App'

describe('Habitat Complexity Observations', () => {
  test('intervals are derived from interval start and interval size fields', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    const intervalSizeInput = await screen.findByTestId('interval-size-input')
    const intervalStartInput = await screen.findByTestId('interval-start-input')
    await user.clear(intervalStartInput)
    // interval start has a default value or 1, so we need to clear it so that our test typing produces 0 instead of 10
    await user.type(intervalStartInput, '0')

    await user.type(intervalSizeInput, '5')

    const observationsSection = await screen.findByTestId('observations-section')
    const addRowButton = within(observationsSection).getByTestId('add-observation-row')
    const getIntervalCells = () => within(observationsSection).getAllByTestId('interval-cell')

    await user.click(addRowButton)
    await user.click(addRowButton)
    await user.click(addRowButton)
    await user.click(addRowButton)

    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[0]).toHaveTextContent('0m')
    })

    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[1]).toHaveTextContent('5m')
    })

    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[2]).toHaveTextContent('10m')
    })

    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[3]).toHaveTextContent('15m')
    })

    // user changes interval size value
    await user.clear(intervalSizeInput)
    await user.type(intervalSizeInput, '100')

    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[0]).toHaveTextContent('0m')
    })
    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[1]).toHaveTextContent('100m')
    })

    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[2]).toHaveTextContent('200m')
    })
    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[3]).toHaveTextContent('300m')
    })
    await waitFor(() => {
      const intervalCells = getIntervalCells()
      expect(intervalCells[4]).toHaveTextContent('400m')
    })
  })

  test('intervals begin at interval start when checked', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    const intervalSizeInput = await screen.findByTestId('interval-size-input')
    const intervalStartInput = await screen.findByTestId('interval-start-input')
    const intervalStartCheckbox = await screen.findByTestId('interval-start-sync-checkbox')

    await user.clear(intervalStartInput)
    await user.type(intervalSizeInput, '5')
    await user.click(intervalStartCheckbox)

    const observationsSection = await screen.findByTestId('observations-section')

    const addRowButton = within(observationsSection).getByTestId('add-observation-row')
    await user.click(addRowButton)
    await user.click(addRowButton)
    await user.click(addRowButton)
    await user.click(addRowButton)

    const getIntervalCells = () => within(observationsSection).getAllByTestId('interval-cell')

    await waitFor(() => {
      expect(getIntervalCells()[0]).toHaveTextContent('5m')
    })

    await waitFor(() => {
      expect(getIntervalCells()[1]).toHaveTextContent('10m')
    })

    await waitFor(() => {
      expect(getIntervalCells()[2]).toHaveTextContent('15m')
    })

    await waitFor(() => {
      expect(getIntervalCells()[3]).toHaveTextContent('20m')
    })
  })

  test('Habitat Complexity observations: intervals recalculate when user deletes an observation', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    const intervalSizeInput = await screen.findByTestId('interval-size-input')
    const intervalStartCheckbox = await screen.findByTestId('interval-start-sync-checkbox')

    await user.type(intervalSizeInput, '5')

    const observationsSection = await screen.findByTestId('observations-section')
    const getIntervalCells = () => within(observationsSection).getAllByTestId('interval-cell')

    await waitFor(() => {
      expect(getIntervalCells()[0]).toHaveTextContent('0m')
    })

    await user.click(intervalStartCheckbox)

    await waitFor(() => {
      expect(getIntervalCells()[0]).toHaveTextContent('5m')
    })

    const addRowButton = within(observationsSection).getByTestId('add-observation-row')

    await user.click(addRowButton)
    await user.click(addRowButton)
    await user.click(addRowButton)

    const getIntervalCellsAfterAdds = () =>
      within(observationsSection).getAllByTestId('interval-cell')
    expect(getIntervalCellsAfterAdds()).toHaveLength(4)

    await waitFor(() => {
      expect(getIntervalCellsAfterAdds()[0]).toHaveTextContent('5m')
    })
    await waitFor(() => {
      expect(getIntervalCellsAfterAdds()[1]).toHaveTextContent('10m')
    })
    await waitFor(() => {
      expect(getIntervalCellsAfterAdds()[2]).toHaveTextContent('15m')
    })
    await waitFor(() => {
      expect(getIntervalCellsAfterAdds()[3]).toHaveTextContent('20m')
    })

    // delete the first observation, the intervals should recalculate

    const observationRows = within(observationsSection).getAllByRole('row')

    // first row is table headers, second is observation row
    await user.hover(observationRows[1])
    await user.click(within(observationRows[1]).getByTestId('delete-observation-button'))

    const observationIntervalLabelsAfterObservationDelete =
      within(observationsSection).getAllByTestId('interval-cell')

    expect(observationIntervalLabelsAfterObservationDelete[0]).toHaveTextContent('5m')
    expect(observationIntervalLabelsAfterObservationDelete[1]).toHaveTextContent('10m')
    expect(observationIntervalLabelsAfterObservationDelete[2]).toHaveTextContent('15m')
    expect(observationIntervalLabelsAfterObservationDelete[3]).toBeUndefined()
  })

  test('Habitat Complexity observations: intervals reclaculate when a user inserts a row using the enter key', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/habitatcomplexity'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    const intervalSizeInput = await screen.findByTestId('interval-size-input')

    await user.type(intervalSizeInput, '5')

    const observationsSection = await screen.findByTestId('observations-section')
    const addRowButton = within(observationsSection).getByTestId('add-observation-row')

    await user.click(addRowButton)
    await user.click(addRowButton)
    await user.click(addRowButton)
    const observationIntervalLabelsAfterFourRowsAdded =
      within(observationsSection).getAllByTestId('interval-cell')

    await waitFor(() => {
      expect(observationIntervalLabelsAfterFourRowsAdded[0]).toHaveTextContent('0m')
    })
    await waitFor(() => {
      expect(observationIntervalLabelsAfterFourRowsAdded[1]).toHaveTextContent('5m')
    })
    await waitFor(() => {
      expect(observationIntervalLabelsAfterFourRowsAdded[2]).toHaveTextContent('10m')
    })
    await waitFor(() => {
      expect(observationIntervalLabelsAfterFourRowsAdded[3]).toHaveTextContent('15m')
    })
    await waitFor(() => {
      expect(observationIntervalLabelsAfterFourRowsAdded[4]).toBeUndefined()
    })

    // hit enter key to duplicate first observation into second place below first
    const firstGrowthFormInput = within(observationsSection).getAllByTestId(
      'habitat-complexity-score-select',
    )[0]

    // userEvent doesnt work as expected for Enter
    fireEvent.keyDown(firstGrowthFormInput, { key: 'Enter', code: 'Enter' })
    const observationIntervalLabelsAfterEnterKey =
      within(observationsSection).getAllByTestId('interval-cell')

    await waitFor(() => {
      expect(observationIntervalLabelsAfterEnterKey[0]).toHaveTextContent('0m')
    })

    await waitFor(() => {
      expect(observationIntervalLabelsAfterEnterKey[1]).toHaveTextContent('5m')
    })
    await waitFor(() => {
      expect(observationIntervalLabelsAfterEnterKey[2]).toHaveTextContent('10m')
    })
    await waitFor(() => {
      expect(observationIntervalLabelsAfterEnterKey[3]).toHaveTextContent('15m')
    })
    await waitFor(() => {
      expect(observationIntervalLabelsAfterEnterKey[4]).toHaveTextContent('20m')
    })
  })
})
