import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

test('Bleaching percent cover observations: tab in count input on last row duplicates row', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('edit-collect-record-form-title')

  const formBeforeTab = screen.getByRole('form')
  // percent cover observations are in the second table
  const observationsTableBeforeTabKey = within(formBeforeTab).getByLabelText(
    'Observations - Percent Cover',
  )

  // one and three observations
  expect(within(observationsTableBeforeTabKey).getAllByRole('row').length).toEqual(4)

  const lastMacroalgeePercentCoverInput = within(observationsTableBeforeTabKey).getByDisplayValue(
    '70',
  )

  // userEvent doesnt work as expected for tab
  fireEvent.keyDown(lastMacroalgeePercentCoverInput, { key: 'Tab', code: 'Tab' })

  const formAfterTab = screen.getByRole('form')
  const observationsTableAfterTab = within(formAfterTab).getByLabelText(
    'Observations - Percent Cover',
  )

  expect(within(observationsTableAfterTab).getAllByRole('row').length).toEqual(5)

  expect(within(observationsTableAfterTab).getAllByDisplayValue('70').length).toEqual(2)
  const hardCoralInputs = within(observationsTableAfterTab).getAllByDisplayValue('50')

  expect(hardCoralInputs.length).toEqual(4)

  const newHardCoralInput = hardCoralInputs[3]

  expect(newHardCoralInput).toHaveFocus()
})

test('Bleaching percent cover observations: enter key adds a new empty row below row where key pressed', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('edit-collect-record-form-title')

  const formBeforeEnterKey = screen.getByRole('form')
  // percent cover observations are in the second table
  const observationsTableBeforeEnterKey = within(formBeforeEnterKey).getByLabelText(
    'Observations - Percent Cover',
  )

  // one header row and three observations
  expect(within(observationsTableBeforeEnterKey).getAllByRole('row').length).toEqual(4)

  const firstMacroalgeePercentcoverInput = within(
    observationsTableBeforeEnterKey,
  ).getByDisplayValue('90')

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstMacroalgeePercentcoverInput, { key: 'Enter', code: 'Enter' })

  const formAfterEnterKey = screen.getByRole('form')
  const observationsTableAfterEnterKey = within(formAfterEnterKey).getByLabelText(
    'Observations - Percent Cover',
  )

  expect(within(observationsTableAfterEnterKey).getAllByRole('row').length).toEqual(5)

  // 0 is the header
  const secondObservationRow = within(observationsTableAfterEnterKey).getAllByRole('row')[2]

  expect(within(secondObservationRow).queryAllByDisplayValue('').length).toEqual(3)
})
