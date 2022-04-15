import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import userEvent from '@testing-library/user-event'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'

import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'

test('Fishbelt observations add new species - filling out new species form adds a new species to dexie and the observation fish name input', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('edit-collect-record-form-title')

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/pull/`,

      (req, res, ctx) => {
        return res(
          ctx.json({
            fish_species: {
              updates: [
                {
                  id: 'whatever',
                  display_name: 'Nebrius ridens',
                },
              ],
            },
          }),
        )
      },
    ),
  )

  const fishbeltForm = screen.getByRole('form')
  const observationsTable = (await within(fishbeltForm).findAllByRole('table'))[0]

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
    name: 'Next',
  })

  userEvent.click(nextScreenButton)

  expect(
    await within(modal).findByText(
      'Your proposed new species will be reviewed by the MERMAID team. They will either approve it for inclusion in the taxonomy or contact you to follow up.',
    ),
  )

  const speciesNameElement = within(modal).getByLabelText('Species')
  const userNameElement = within(modal).getByLabelText('User')
  const projectNameElement = within(modal).getByLabelText('Project')

  expect(within(userNameElement).getByText('FakeFirstNameOnline FakeLastNameOnline'))
  expect(within(projectNameElement).getByText('Project V'))
  expect(within(speciesNameElement).getByText('ridens'))

  const submitButton = within(modal).getByRole('button', {
    name: 'Send to MERMAID for review',
  })

  userEvent.click(submitButton)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('Add New Fish Species'))
  const fishbeltFormAfterSubmit = screen.getByRole('form')

  expect(await within(fishbeltFormAfterSubmit).findByDisplayValue('Nebrius ridens'))

  const proposedSpeciesSavedToast = await screen.findByText(
    'Proposed fish species saved. The observation has been edited to show it selected.',
  )

  expect(proposedSpeciesSavedToast).toBeInTheDocument()

  const updatedSpeciesInOfflineStorage = await dexiePerUserDataInstance.fish_species.toArray()

  const newSpecies = updatedSpeciesInOfflineStorage.find(
    (species) => species.display_name === 'Nebrius ridens',
  )

  expect(newSpecies).toBeTruthy()
})

test('Fishbelt observations add new species - proposing new species that already exists results in no added species, and a toast message warning.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  // loading indicator is weird in integration tests, so we wait for the page title

  await screen.findByTestId('edit-collect-record-form-title')

  const fishbeltForm = screen.getByRole('form')
  const observationsTable = (await within(fishbeltForm).findAllByRole('table'))[0]

  // need to wait until app loaded and offline storage hydration before getting species count
  const speciesInOfflineStorageCount = (await dexiePerUserDataInstance.fish_species.toArray())
    .length

  expect(speciesInOfflineStorageCount).toEqual(4)

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

  userEvent.type(genusInput, 'holo')

  const genusAutocompleteList = within(modal).getByRole('listbox')

  const hologymnosusOption = within(modal).getByRole('option', {
    name: 'Hologymnosus',
  })

  userEvent.selectOptions(genusAutocompleteList, hologymnosusOption)

  // note uppercase first letter. Species names must be transformed to lowercase
  userEvent.type(speciesInput, 'Longipes')

  const nextScreenButton = await within(modal).findByRole('button', {
    name: 'Next',
  })

  userEvent.click(nextScreenButton)

  const submitButton = await within(modal).findByRole('button', {
    name: 'Send to MERMAID for review',
  })

  userEvent.click(submitButton)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('Add New Fish Species'))
  const fishbeltFormAfterSubmit = screen.getByRole('form')

  // input display value is updated with *existing* species selected
  expect(await within(fishbeltFormAfterSubmit).findByDisplayValue('Hologymnosus longipes'))

  const proposedSpeciesIsDuplicateToast = await screen.findByText(
    'The proposed fish species already exists in the list. The observation has been edited to show the existing species selected.',
  )

  expect(proposedSpeciesIsDuplicateToast).toBeInTheDocument()

  const speciesInOfflineStorageCountAfterRedundantNewSpeciesSubmit = (
    await dexiePerUserDataInstance.fish_species.toArray()
  ).length

  const isSpeciesInOfflineStorageUnchanged =
    speciesInOfflineStorageCountAfterRedundantNewSpeciesSubmit === speciesInOfflineStorageCount

  expect(isSpeciesInOfflineStorageUnchanged).toBeTruthy()
})
