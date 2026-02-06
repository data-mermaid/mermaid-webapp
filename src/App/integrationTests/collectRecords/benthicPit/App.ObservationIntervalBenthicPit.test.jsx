import { expect, test } from "vitest";
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

test('Benthic Pit observations: intervals are derived from interval start and interval size fields', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const intervalSize = await screen.findByTestId('interval-size-input')

  await user.type(intervalSize, '5')
  const intervalStart = await screen.findByTestId('interval-start-input')

  // interval start has a default value or 1, so we need to clear it so that our test typing produces 0 instead of 10
  await user.clear(intervalStart)
  await user.type(intervalStart, '0')
  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByTestId('add-observation-row')
  const getIntervalCells = () => within(observationsSection).getAllByTestId('interval-cell')

  await user.click(addRowButton)
  await user.click(addRowButton)
  await user.click(addRowButton)
  await waitFor(() => {
    expect(getIntervalCells()[0]).toHaveTextContent('0.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[1]).toHaveTextContent('5.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[2]).toHaveTextContent('10.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[3]).toHaveTextContent('15.0m')
  })

  // user changes interval start value
  await user.clear(intervalStart)
  await user.type(intervalStart, '5')
  await waitFor(() => {
    expect(getIntervalCells()[0]).toHaveTextContent('5.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[1]).toHaveTextContent('10.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[2]).toHaveTextContent('15.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[3]).toHaveTextContent('20.0m')
  })

  // user changes interval size value
  await user.clear(intervalSize)
  await user.type(intervalSize, '100')
  await waitFor(() => {
    expect(getIntervalCells()[0]).toHaveTextContent('5.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[1]).toHaveTextContent('105.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[2]).toHaveTextContent('205.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[3]).toHaveTextContent('305.0m')
  })
})

test('Benthic PIT observations: intervals recalculate when user deletes an observation', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const intervalSize = await screen.findByTestId('interval-size-input')

  await user.type(intervalSize, '5')
  const intervalStart = await screen.findByTestId('interval-start-input')

  // interval start has a default value or 1, so we need to clear it so that our test typing produces 0 instead of 10
  await user.clear(intervalStart)
  await user.type(intervalStart, '0')
  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByTestId('add-observation-row')
  const getIntervalCells = () => within(observationsSection).getAllByTestId('interval-cell')

  await user.click(addRowButton)
  await user.click(addRowButton)
  await user.click(addRowButton)
  await waitFor(() => {
    expect(getIntervalCells()[0]).toHaveTextContent('0.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[1]).toHaveTextContent('5.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[2]).toHaveTextContent('10.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[3]).toHaveTextContent('15.0m')
  })

  // delete the first observation, the intervals should recalculate

  const observationRows = within(observationsSection).getAllByRole('row')

  // first row is table headers, second is observation row
  await user.hover(observationRows[1])
  await user.click(within(observationRows[1]).getByTestId('delete-observation-button'))

  const intervalCellsAfterDelete = within(observationsSection).getAllByTestId('interval-cell')

  expect(intervalCellsAfterDelete[0]).toHaveTextContent('0.0m')
  expect(intervalCellsAfterDelete[1]).toHaveTextContent('5.0m')
  expect(intervalCellsAfterDelete[2]).toHaveTextContent('10.0m')
  expect(intervalCellsAfterDelete[3]).toBeUndefined()
})

test('Benthic Pit observations: intervals reclaculate when a user inserts a row using the enter key', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const intervalSize = await screen.findByTestId('interval-size-input')

  await user.type(intervalSize, '5')
  const intervalStart = await screen.findByTestId('interval-start-input')

  // interval start has a default value or 1, so we need to clear it so that our test typing produces 0 instead of 10
  await user.clear(intervalStart)
  await user.type(intervalStart, '0')
  const observationsSection = await screen.findByTestId('observations-section')
  const addRowButton = within(observationsSection).getByTestId('add-observation-row')
  const getIntervalCells = () => within(observationsSection).getAllByTestId('interval-cell')

  await user.click(addRowButton)
  await user.click(addRowButton)
  await user.click(addRowButton)
  await waitFor(() => {
    expect(getIntervalCells()[0]).toHaveTextContent('0.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[1]).toHaveTextContent('5.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[2]).toHaveTextContent('10.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[3]).toHaveTextContent('15.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[4]).toBeUndefined()
  })

  // hit enter key to duplicate first observation into second place below first
  const firstGrowthFormInput = within(observationsSection).getAllByTestId('growth-form-select')[0]

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstGrowthFormInput, { key: 'Enter', code: 'Enter' })
  await waitFor(() => {
    expect(getIntervalCells()[0]).toHaveTextContent('0.0m')
  })

  await waitFor(() => {
    expect(getIntervalCells()[1]).toHaveTextContent('5.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[2]).toHaveTextContent('10.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[3]).toHaveTextContent('15.0m')
  })
  await waitFor(() => {
    expect(getIntervalCells()[4]).toHaveTextContent('20.0m')
  })
})
