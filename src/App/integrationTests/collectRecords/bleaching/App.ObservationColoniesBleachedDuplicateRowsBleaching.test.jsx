import { expect, test } from 'vitest'
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

test('Bleaching colonies bleached observations: tab in count input on last row duplicates row', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('record-form-title')

  const formBeforeTab = screen.getByRole('form')
  const observationsTableBeforeTabKey = within(formBeforeTab).getAllByRole('table')[0]

  // two header rows and three observations
  expect(within(observationsTableBeforeTabKey).getAllByRole('row').length).toEqual(5)

  const lastRecentlyDeadInput = within(observationsTableBeforeTabKey).getByDisplayValue('700')

  // userEvent doesnt work as expected for tab
  fireEvent.keyDown(lastRecentlyDeadInput, { key: 'Tab', code: 'Tab' })

  const formAfterTab = screen.getByRole('form')
  const observationsTableAfterTab = within(formAfterTab).getAllByRole('table')[0]

  expect(within(observationsTableAfterTab).getAllByRole('row').length).toEqual(6)

  expect(within(observationsTableAfterTab).getAllByDisplayValue('700').length).toEqual(2)
  expect(
    within(observationsTableAfterTab).getAllByDisplayValue('Dead Coral with Algae').length,
  ).toEqual(4)

  const newBenthicAttributeInput =
    within(observationsTableAfterTab).getAllByDisplayValue('Dead Coral with Algae')[3]

  expect(newBenthicAttributeInput).toHaveFocus()
})

test('Bleaching colonies bleached observations: enter key adds a new empty row below row where key pressed', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('record-form-title')

  const formBeforeEnterKey = screen.getByRole('form')
  const observationsTableBeforeEnterKey = within(formBeforeEnterKey).getAllByRole('table')[0]

  // two header rows and three observations
  expect(within(observationsTableBeforeEnterKey).getAllByRole('row').length).toEqual(5)

  const firstRecentlyDeadInput = within(observationsTableBeforeEnterKey).getByDisplayValue('900')

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstRecentlyDeadInput, { key: 'Enter', code: 'Enter' })

  const formAfterEnterKey = screen.getByRole('form')
  const observationsTableAfterEnterKey = within(formAfterEnterKey).getAllByRole('table')[0]

  expect(within(observationsTableAfterEnterKey).getAllByRole('row').length).toEqual(6)

  // 0 and 1 are the headers
  const secondObservationRow = within(observationsTableAfterEnterKey).getAllByRole('row')[3]

  // assert new observation uses default values and doesnt copy previous row values
  expect(within(secondObservationRow).queryAllByDisplayValue('').length).toEqual(2) // select inputs
  expect(within(secondObservationRow).queryAllByDisplayValue('0').length).toEqual(7) // numeric inputs
})
