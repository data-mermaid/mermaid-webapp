import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'

import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import App from '../../../App'

test('Benthic Pit observations: intervals are derived from interval start and interval size fields', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const intervalSize = await screen.findByLabelText('Interval Size')

  userEvent.type(intervalSize, '5')
  const intervalStart = await screen.findByLabelText('Interval Start')

  // interval start has a default value or 1, so we need to clear it so that our test typing produces 0 instead of 10
  userEvent.clear(intervalStart)
  userEvent.type(intervalStart, '0')
  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByRole('button', { name: 'Add Row' })

  userEvent.click(addRowButton)
  userEvent.click(addRowButton)
  userEvent.click(addRowButton)

  await waitFor(() => {
    const observationIntervalLabelsAfterFourRowsAdded =
      within(observationsSection).getAllByLabelText('Interval')

    expect(observationIntervalLabelsAfterFourRowsAdded[0]).toHaveTextContent('0.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[1]).toHaveTextContent('5.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[2]).toHaveTextContent('10.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[3]).toHaveTextContent('15.0m')
  })

  // user changes interval start value
  userEvent.clear(intervalStart)
  userEvent.type(intervalStart, '5')

  await waitFor(() => {
    const observationIntervalLabelsAfterIntervalStartChange =
      within(observationsSection).getAllByLabelText('Interval')

    expect(observationIntervalLabelsAfterIntervalStartChange[0]).toHaveTextContent('5.0m')
    expect(observationIntervalLabelsAfterIntervalStartChange[1]).toHaveTextContent('10.0m')
    expect(observationIntervalLabelsAfterIntervalStartChange[2]).toHaveTextContent('15.0m')
    expect(observationIntervalLabelsAfterIntervalStartChange[3]).toHaveTextContent('20.0m')
  })

  // user changes interval size value
  userEvent.clear(intervalSize)
  userEvent.type(intervalSize, '100')

  await waitFor(() => {
    const observationIntervalLabelsAfterIntervalSizeChange =
      within(observationsSection).getAllByLabelText('Interval')

    expect(observationIntervalLabelsAfterIntervalSizeChange[0]).toHaveTextContent('5.0m')
    expect(observationIntervalLabelsAfterIntervalSizeChange[1]).toHaveTextContent('105.0m')
    expect(observationIntervalLabelsAfterIntervalSizeChange[2]).toHaveTextContent('205.0m')
    expect(observationIntervalLabelsAfterIntervalSizeChange[3]).toHaveTextContent('305.0m')
  })
})

test('Benthic PIT observations: intervals recalculate when user deletes an observation', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const intervalSize = await screen.findByLabelText('Interval Size')

  userEvent.type(intervalSize, '5')
  const intervalStart = await screen.findByLabelText('Interval Start')

  // interval start has a default value or 1, so we need to clear it so that our test typing produces 0 instead of 10
  userEvent.clear(intervalStart)
  userEvent.type(intervalStart, '0')
  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByRole('button', { name: 'Add Row' })

  userEvent.click(addRowButton)
  userEvent.click(addRowButton)
  userEvent.click(addRowButton)

  await waitFor(() => {
    const observationIntervalLabelsAfterFourRowsAdded =
      within(observationsSection).getAllByLabelText('Interval')

    expect(observationIntervalLabelsAfterFourRowsAdded[0]).toHaveTextContent('0.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[1]).toHaveTextContent('5.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[2]).toHaveTextContent('10.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[3]).toHaveTextContent('15.0m')
  })

  // delete the first observation, the intervals should recalculate

  const observationRows = within(screen.getByLabelText('Observations')).getAllByRole('row')

  // first row is table headers, second is observation row
  userEvent.hover(observationRows[1])
  userEvent.click(within(observationRows[1]).getByLabelText('Delete Observation'))

  const observationIntervalLabelsAfterObservationDelete =
    within(observationsSection).getAllByLabelText('Interval')

  expect(observationIntervalLabelsAfterObservationDelete[0]).toHaveTextContent('0.0m')
  expect(observationIntervalLabelsAfterObservationDelete[1]).toHaveTextContent('5.0m')
  expect(observationIntervalLabelsAfterObservationDelete[2]).toHaveTextContent('10.0m')
  expect(observationIntervalLabelsAfterObservationDelete[3]).toBeUndefined()
})

test('Benthic Pit observations: intervals reclaculate when a user inserts a row using the enter key', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const intervalSize = await screen.findByLabelText('Interval Size')

  userEvent.type(intervalSize, '5')
  const intervalStart = await screen.findByLabelText('Interval Start')

  // interval start has a default value or 1, so we need to clear it so that our test typing produces 0 instead of 10
  userEvent.clear(intervalStart)
  userEvent.type(intervalStart, '0')
  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByRole('button', { name: 'Add Row' })

  userEvent.click(addRowButton)
  userEvent.click(addRowButton)
  userEvent.click(addRowButton)

  await waitFor(() => {
    const observationIntervalLabelsAfterFourRowsAdded =
      within(observationsSection).getAllByLabelText('Interval')

    expect(observationIntervalLabelsAfterFourRowsAdded[0]).toHaveTextContent('0.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[1]).toHaveTextContent('5.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[2]).toHaveTextContent('10.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[3]).toHaveTextContent('15.0m')
    expect(observationIntervalLabelsAfterFourRowsAdded[4]).toBeUndefined()
  })

  // hit enter key to duplicate first observation into second place below first
  const firstGrowthFormInput = within(observationsSection).getAllByLabelText('Growth Form')[0]

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstGrowthFormInput, { key: 'Enter', code: 'Enter' })

  await waitFor(() => {
    const observationIntervalLabelsAfterEnterKey =
      within(observationsSection).getAllByLabelText('Interval')

    expect(observationIntervalLabelsAfterEnterKey[0]).toHaveTextContent('0.0m')
    expect(observationIntervalLabelsAfterEnterKey[1]).toHaveTextContent('5.0m')
    expect(observationIntervalLabelsAfterEnterKey[2]).toHaveTextContent('10.0m')
    expect(observationIntervalLabelsAfterEnterKey[3]).toHaveTextContent('15.0m')
    expect(observationIntervalLabelsAfterEnterKey[4]).toHaveTextContent('20.0m')
  })
})
