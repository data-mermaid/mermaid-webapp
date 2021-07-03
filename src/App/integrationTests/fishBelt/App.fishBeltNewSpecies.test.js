import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'

import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'

import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'

test('Fishbelt observations add new species - filling out new species form adds a new species to dexie and the observation fish name input', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/fishbelt/2'],
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('edit-collect-record-form-title')

  const fishbeltForm = screen.getByRole('form')
  const observationsTable = await within(fishbeltForm).findByRole('table')

  await waitFor(() =>
    expect(
      screen.queryAllByLabelText('fish name loading indicator').length,
    ).toEqual(0),
  )

  const firstFishNameInput = within(observationsTable).getByDisplayValue(
    'Lethrinus rubrioperculatus',
  )

  userEvent.type(firstFishNameInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByRole('button', {
    name: 'Propose New Species...',
  })

  userEvent.click(noResultsButton)

  const modal = screen.getByLabelText('Add New Fish Species')

  const genusInput = await within(modal).findByLabelText('Genus')
  const speciesInput = within(modal).getByLabelText('Species')

  userEvent.type(genusInput, 'Neb')

  const genusAutocompleteList = within(modal).getByRole('listbox')

  const nebriusOption = within(modal).getByRole('option', {
    name: 'Nebrius',
  })

  userEvent.selectOptions(genusAutocompleteList, nebriusOption)

  // note uppercase first letter. Species names must be transformed to lowercase
  userEvent.type(speciesInput, 'Ridens')

  const nextScreenButton = within(modal).getByRole('button', {
    name: 'Propose new species',
  })

  userEvent.click(nextScreenButton)

  expect(
    await within(modal).findByText(
      "I'd like to propose a new species called Nebrius ridens.",
    ),
  )

  const userNameElement = within(modal).getByLabelText('User:')
  const projectNameElement = within(modal).getByLabelText('Project:')

  expect(
    within(userNameElement).getByText('FakeFirstNameOnline FakeLastNameOnline'),
  )
  expect(within(projectNameElement).getByText('Project V'))

  const submitButton = within(modal).getByRole('button', {
    name: 'Send to MERMAID for review',
  })

  userEvent.click(submitButton)

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('Add New Fish Species'),
  )
  const fishbeltFormAfterSubmit = screen.getByRole('form')

  expect(
    await within(fishbeltFormAfterSubmit).findByDisplayValue('Nebrius ridens'),
  )

  const updatedSpeciesInOfflineStorage = await dexieInstance.fishSpecies.toArray()
  const nameOfLastSpeciesInOfflineStorage =
    updatedSpeciesInOfflineStorage[updatedSpeciesInOfflineStorage.length - 1]
      .display_name

  expect(nameOfLastSpeciesInOfflineStorage).toEqual('Nebrius ridens')
})
