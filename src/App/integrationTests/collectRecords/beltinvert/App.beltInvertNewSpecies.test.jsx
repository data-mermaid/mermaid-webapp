import '@testing-library/jest-dom'
import { http, HttpResponse } from 'msw'
import React from 'react'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

test('Macroinvertebrate observations add new species - filling out new species form adds a new species to dexie and the observation macroinvertebrate name input', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-2'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('record-form-title')

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

      () => {
        return HttpResponse.json({
          invert_attributes: {
            updates: [
              {
                id: 'whatever',
                display_name: 'Nebrius ridens',
              },
            ],
          },
        })
      },
    ),
  )

  const beltInvertForm = screen.getByRole('form')
  const observationsTable = (await within(beltInvertForm).findAllByRole('table'))[0]

  const firstMacroinvertebrateNameInput =
    within(observationsTable).getByDisplayValue('Diadema spp.')

  await user.type(firstMacroinvertebrateNameInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByTestId('propose-new-species-button')

  await user.click(noResultsButton)

  const modal = await screen.findByTestId('attribute-proposal-modal')

  const genusInput = await within(modal).findByTestId('attribute-label')
  const speciesInput = within(modal).getByTestId('new-attribute-name')

  await user.type(genusInput, 'Neb')

  const genusAutocompleteList = within(modal).getByRole('listbox')

  const nebriusOption = within(modal).getByRole('option', {
    name: 'Nebrius',
  })

  await user.selectOptions(genusAutocompleteList, nebriusOption)

  // note uppercase first letter. Species names must be transformed to lowercase
  await user.type(speciesInput, 'Ridens')

  const nextScreenButton = within(modal).getByTestId('next-form-page')

  await user.click(nextScreenButton)

  expect(await within(modal).findByTestId('proposed-summary'))

  const speciesNameElement = within(modal).getByTestId('proposed-attribute-type')
  const userNameElement = within(modal).getByTestId('proposed-attribute-user')
  const projectNameElement = within(modal).getByTestId('proposed-attribute-project')

  expect(within(userNameElement).getByText('W-FakeFirstNameOnline W-FakeLastNameOnline'))
  expect(within(projectNameElement).getByText('Project V'))
  expect(within(speciesNameElement).getByText('Nebrius ridens'))

  const submitButton = within(modal).getByTestId('submit-proposal-button')

  await user.click(submitButton)

  await waitFor(() => expect(screen.queryByTestId('attribute-proposal-modal')).not.toBeInTheDocument())
  const beltInvertFormAfterSubmit = screen.getByRole('form')

  expect(await within(beltInvertFormAfterSubmit).findByDisplayValue('Nebrius ridens'))

  //Expect success message

  await waitFor(async () => {
    const updatedSpeciesInOfflineStorage =
      await dexiePerUserDataInstance.invert_attributes.toArray()
    const newSpecies = updatedSpeciesInOfflineStorage.find(
      (species) => species.display_name === 'Nebrius ridens',
    )
    expect(newSpecies).toBeTruthy()
  })
})

test('Macroinvertebrate observations add new species - proposing new species that already exists results in no added species, and a toast message warning.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-2'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  // loading indicator is weird in integration tests, so we wait for the page title

  await screen.findByTestId('record-form-title')

  const beltInvertForm = screen.getByRole('form')
  const observationsTable = (await within(beltInvertForm).findAllByRole('table'))[0]

  // need to wait until app loaded and offline storage hydration before getting species count
  const speciesInOfflineStorageCount = (await dexiePerUserDataInstance.invert_attributes.toArray())
    .length

  expect(speciesInOfflineStorageCount).toEqual(5)

  const firstInvertNameInput = within(observationsTable).getByDisplayValue('Diadema spp.')

  await user.type(firstInvertNameInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByTestId('propose-new-species-button')

  await user.click(noResultsButton)

  const modal = await screen.findByTestId('attribute-proposal-modal')

  const genusInput = await within(modal).findByTestId('attribute-label')
  const speciesInput = within(modal).getByTestId('new-attribute-name')

  await user.type(genusInput, 'Diadema')

  const genusAutocompleteList = within(modal).getByRole('listbox')

  const diademaOption = within(modal).getByRole('option', {
    name: 'Diadema',
  })

  await user.selectOptions(genusAutocompleteList, diademaOption)

  // note uppercase first letter. Species names must be transformed to lowercase
  await user.type(speciesInput, 'Spp.')

  const nextScreenButton = within(modal).getByTestId('next-form-page')

  await user.click(nextScreenButton)

  const submitButton = within(modal).getByTestId('submit-proposal-button')

  await user.click(submitButton)

  await waitFor(() => expect(screen.queryByTestId('attribute-proposal-modal')).not.toBeInTheDocument())
  const beltInvertFormAfterSubmit = screen.getByRole('form')

  // input display value is updated with *existing* species selected
  expect(await within(beltInvertFormAfterSubmit).findByDisplayValue('Diadema spp.'))

  // Expect duplicate message toast popup

  await waitFor(async () => {
    const speciesInOfflineStorageCountAfterRedundantNewSpeciesSubmit = (
      await dexiePerUserDataInstance.invert_attributes.toArray()
    ).length

    expect(speciesInOfflineStorageCountAfterRedundantNewSpeciesSubmit).toEqual(
      speciesInOfflineStorageCount,
    )
  })
})
