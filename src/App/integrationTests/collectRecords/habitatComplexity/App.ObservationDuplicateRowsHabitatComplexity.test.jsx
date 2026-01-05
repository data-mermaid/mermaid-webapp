import '@testing-library/jest-dom'
import React from 'react'

import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

test('Habitat Complexity observations: tab in count input on last row duplicates row', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('edit-collect-record-form-title')

  const observationsSectionBeforeTabKey = screen.getByTestId('observations-section')
  const observationsTableBeforeTabKey = within(observationsSectionBeforeTabKey).getByRole('table')

  // one header row and three observations
  expect(within(observationsTableBeforeTabKey).getAllByRole('row').length).toEqual(4)

  const lastGrowthFormInput = within(observationsTableBeforeTabKey).getByDisplayValue(
    '1 low (<30cm) and sparse relief',
  )

  // userEvent doesnt work as expected for tab
  fireEvent.keyDown(lastGrowthFormInput, { key: 'Tab', code: 'Tab' })

  const observationsSectionAfterTab = screen.getByTestId('observations-section')
  const observationsTableAfterTab = within(observationsSectionAfterTab).getByRole('table')

  expect(within(observationsTableAfterTab).getAllByRole('row').length).toEqual(5)

  expect(
    within(observationsTableAfterTab).getAllByDisplayValue('1 low (<30cm) and sparse relief')
      .length,
  ).toEqual(2)
  expect(
    within(observationsTableAfterTab).getAllByDisplayValue(
      '0 no vertical relief, flat or rubbly areas',
    ).length,
  ).toEqual(2)

  const newHabitatComplexityScoreInput = within(observationsTableAfterTab).getAllByTestId(
    'habitat-complexity-score-select',
  )[3]

  expect(newHabitatComplexityScoreInput).toHaveFocus()
})

test('Habitat Complexity observations: enter key adds a new empty row below row where key pressed', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('edit-collect-record-form-title')

  const observationsSectionBeforeEnterKey = screen.getByTestId('observations-section')
  const observationsTableBeforeEnterKey = within(observationsSectionBeforeEnterKey).getByRole(
    'table',
  )

  // one header row and three observations
  expect(within(observationsTableBeforeEnterKey).getAllByRole('row').length).toEqual(4)

  const firstGrowthFormInput = within(observationsTableBeforeEnterKey).getAllByTestId(
    'habitat-complexity-score-select',
  )[0]

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstGrowthFormInput, { key: 'Enter', code: 'Enter' })

  const observationsSectionAfterEnterKey = screen.getByTestId('observations-section')
  const observationsTableAfterEnterKey = within(observationsSectionAfterEnterKey).getByRole('table')

  expect(within(observationsTableAfterEnterKey).getAllByRole('row').length).toEqual(5)

  // 0 is the headers
  const secondObservationRow = within(observationsTableAfterEnterKey).getAllByRole('row')[2]

  expect(within(secondObservationRow).queryAllByDisplayValue('').length).toEqual(1)
})
