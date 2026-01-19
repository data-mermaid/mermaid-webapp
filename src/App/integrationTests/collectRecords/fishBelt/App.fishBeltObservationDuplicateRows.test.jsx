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

test('Fishbelt observations: tab in count input on last row duplicates row', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/fishbelt/2'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('record-form-title')

  const formBeforeTab = screen.getByRole('form')
  const observationsTableBeforeTabKey = within(formBeforeTab).getAllByRole('table')[0]

  expect(within(observationsTableBeforeTabKey).getAllByRole('row').length).toEqual(4)

  const lastCountInput = within(observationsTableBeforeTabKey).getByDisplayValue(4)

  // userEvent doesnt work as expected for tab
  fireEvent.keyDown(lastCountInput, { key: 'Tab', code: 'Tab' })

  const formAfterTab = screen.getByRole('form')
  const observationsTableAfterTab = within(formAfterTab).getAllByRole('table')[0]

  expect(within(observationsTableAfterTab).getAllByRole('row').length).toEqual(5)

  expect(within(observationsTableAfterTab).getAllByDisplayValue(4).length).toEqual(2)
  expect(within(observationsTableAfterTab).getAllByDisplayValue('0 - 5').length).toEqual(2)
  expect(within(observationsTableAfterTab).getAllByDisplayValue('Tylosurus choram').length).toEqual(
    2,
  )

  const newFishNameInput =
    within(observationsTableAfterTab).getAllByDisplayValue('Tylosurus choram')[1]

  expect(newFishNameInput).toHaveFocus()
})

test('Fishbelt observations: enter key adds a new empty row below row where key pressed', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/fishbelt/2'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('record-form-title')

  const formBeforeEnterKey = screen.getByRole('form')
  const observationsTableBeforeEnterKey = within(formBeforeEnterKey).getAllByRole('table')[0]

  expect(within(observationsTableBeforeEnterKey).getAllByRole('row').length).toEqual(4)

  const firstCountInput = within(observationsTableBeforeEnterKey).getByDisplayValue(1)

  // userEvent doesnt work as expected for Enter
  fireEvent.keyDown(firstCountInput, { key: 'Enter', code: 'Enter' })

  const formAfterEnterKey = screen.getByRole('form')
  const observationsTableAfterEnterKey = within(formAfterEnterKey).getAllByRole('table')[0]

  expect(within(observationsTableAfterEnterKey).getAllByRole('row').length).toEqual(5)

  // 0 is the headers
  const secondObservationRow = within(observationsTableAfterEnterKey).getAllByRole('row')[2]

  expect(within(secondObservationRow).queryAllByDisplayValue('').length).toEqual(3)
})
