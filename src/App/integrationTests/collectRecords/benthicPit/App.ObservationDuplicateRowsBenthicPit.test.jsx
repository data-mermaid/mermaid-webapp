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

test('Benthic Pit observations: tab in count input on last row duplicates row', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/50'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('record-form-title')

  const formBeforeTab = screen.getByRole('form')
  const observationsTableBeforeTabKey = within(formBeforeTab).getAllByRole('table')[0]

  // one header row and three observations
  expect(within(observationsTableBeforeTabKey).getAllByRole('row').length).toEqual(4)

  const lastGrowthFormInput = within(observationsTableBeforeTabKey).getByDisplayValue('Arborescent')

  // userEvent doesnt work as expected for tab
  fireEvent.keyDown(lastGrowthFormInput, { key: 'Tab', code: 'Tab' })

  const formAfterTab = screen.getByRole('form')
  const observationsTableAfterTab = within(formAfterTab).getAllByRole('table')[0]

  expect(within(observationsTableAfterTab).getAllByRole('row').length).toEqual(5)

  expect(within(observationsTableAfterTab).getAllByDisplayValue('Arborescent').length).toEqual(2)
  expect(
    within(observationsTableAfterTab).getAllByDisplayValue('Dead Coral with Algae').length,
  ).toEqual(4)

  const newBenthicAttributeInput =
    within(observationsTableAfterTab).getAllByDisplayValue('Dead Coral with Algae')[3]

  expect(newBenthicAttributeInput).toHaveFocus()
})

test('Benthic Pit observations: enter key adds a new empty row below row where key pressed', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/50'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('record-form-title')

  const formBeforeEnterKey = screen.getByRole('form')
  const observationsTableBeforeEnterKey = within(formBeforeEnterKey).getAllByRole('table')[0]

  // one header row and three observations
  expect(within(observationsTableBeforeEnterKey).getAllByRole('row').length).toEqual(4)

  const firstGrowthFormInput = within(observationsTableBeforeEnterKey).getByDisplayValue(
    'Branching',
  )

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstGrowthFormInput, { key: 'Enter', code: 'Enter' })

  const formAfterEnterKey = screen.getByRole('form')
  const observationsTableAfterEnterKey = within(formAfterEnterKey).getAllByRole('table')[0]

  expect(within(observationsTableAfterEnterKey).getAllByRole('row').length).toEqual(5)

  // 0 is the headers
  const secondObservationRow = within(observationsTableAfterEnterKey).getAllByRole('row')[2]

  expect(within(secondObservationRow).queryAllByDisplayValue('').length).toEqual(2)
})
