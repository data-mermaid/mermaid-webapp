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

test('Habitat Complexity observations: intervals are derived from interval size fields', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const intervalSize = await screen.findByLabelText('Interval Size')

  await user.type(intervalSize, '5')

  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByRole('button', { name: 'Add Row' })

  await user.click(addRowButton)
  await user.click(addRowButton)
  await user.click(addRowButton)
  await user.click(addRowButton)

  const observationIntervalLabelsAfterFourRowsAdded =
    within(observationsSection).getAllByLabelText('Interval')

  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[0]).toHaveTextContent('1m')
  })

  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[1]).toHaveTextContent('6m')
  })

  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[2]).toHaveTextContent('11m')
  })

  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[3]).toHaveTextContent('16m')
  })

  // user changes interval size value
  await user.clear(intervalSize)
  await user.type(intervalSize, '100')
  const observationIntervalLabelsAfterIntervalSizeChange =
    within(observationsSection).getAllByLabelText('Interval')

  await waitFor(() => {
    expect(observationIntervalLabelsAfterIntervalSizeChange[0]).toHaveTextContent('1m')
  })

  await waitFor(() => {
    expect(observationIntervalLabelsAfterIntervalSizeChange[1]).toHaveTextContent('101m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterIntervalSizeChange[2]).toHaveTextContent('201m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterIntervalSizeChange[3]).toHaveTextContent('301m')
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

  const intervalSize = await screen.findByLabelText('Interval Size')

  await user.type(intervalSize, '5')

  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByRole('button', { name: 'Add Row' })

  await user.click(addRowButton)
  await user.click(addRowButton)
  await user.click(addRowButton)
  const observationIntervalLabelsAfterFourRowsAdded =
    within(observationsSection).getAllByLabelText('Interval')

  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[0]).toHaveTextContent('1m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[1]).toHaveTextContent('6m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[2]).toHaveTextContent('11m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[3]).toHaveTextContent('16m')
  })

  // delete the first observation, the intervals should recalculate

  const observationRows = within(screen.getByLabelText('Observations')).getAllByRole('row')

  // first row is table headers, second is observation row
  await user.hover(observationRows[1])
  await user.click(within(observationRows[1]).getByLabelText('Delete Observation'))

  const observationIntervalLabelsAfterObservationDelete =
    within(observationsSection).getAllByLabelText('Interval')

  expect(observationIntervalLabelsAfterObservationDelete[0]).toHaveTextContent('1m')
  expect(observationIntervalLabelsAfterObservationDelete[1]).toHaveTextContent('6m')
  expect(observationIntervalLabelsAfterObservationDelete[2]).toHaveTextContent('11m')
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

  const intervalSize = await screen.findByLabelText('Interval Size')

  await user.type(intervalSize, '5')

  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByRole('button', { name: 'Add Row' })

  await user.click(addRowButton)
  await user.click(addRowButton)
  await user.click(addRowButton)
  const observationIntervalLabelsAfterFourRowsAdded =
    within(observationsSection).getAllByLabelText('Interval')

  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[0]).toHaveTextContent('1m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[1]).toHaveTextContent('6m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[2]).toHaveTextContent('11m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[3]).toHaveTextContent('16m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterFourRowsAdded[4]).toBeUndefined()
  })

  // hit enter key to duplicate first observation into second place below first
  const firstGrowthFormInput = within(observationsSection).getAllByLabelText(
    'Habitat Complexity Score',
  )[0]

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstGrowthFormInput, { key: 'Enter', code: 'Enter' })
  const observationIntervalLabelsAfterEnterKey =
    within(observationsSection).getAllByLabelText('Interval')

  await waitFor(() => {
    expect(observationIntervalLabelsAfterEnterKey[0]).toHaveTextContent('1m')
  })

  await waitFor(() => {
    expect(observationIntervalLabelsAfterEnterKey[1]).toHaveTextContent('6m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterEnterKey[2]).toHaveTextContent('11m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterEnterKey[3]).toHaveTextContent('16m')
  })
  await waitFor(() => {
    expect(observationIntervalLabelsAfterEnterKey[4]).toHaveTextContent('21m')
  })
})
