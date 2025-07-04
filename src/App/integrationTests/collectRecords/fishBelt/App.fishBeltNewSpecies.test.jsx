import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

beforeEach(() => {
  jest.mock('react-i18next', () => ({
    useTranslation: () => {
      return {
        t: (i18nKey) => i18nKey,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      }
    },
    initReactI18next: {
      type: '3rdParty',
      init: () => {},
    },
  }))
})

test('Fishbelt observations add new species - filling out new species form adds a new species to dexie and the observation fish name input', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
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
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

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

  await user.type(firstFishNameInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByRole('button', {
    name: 'Propose New Species...',
  })

  await user.click(noResultsButton)

  const modal = screen.getByTestId('attribute-proposal-modal')

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

  expect(screen.queryByTestId('attribute-proposal-modal')).not.toBeInTheDocument()
  const fishbeltFormAfterSubmit = screen.getByRole('form')

  expect(await within(fishbeltFormAfterSubmit).findByDisplayValue('Nebrius ridens'))

  //Expect success message

  const updatedSpeciesInOfflineStorage = await dexiePerUserDataInstance.fish_species.toArray()

  const newSpecies = updatedSpeciesInOfflineStorage.find(
    (species) => species.display_name === 'Nebrius ridens',
  )

  expect(newSpecies).toBeTruthy()
})

test('Fishbelt observations add new species - proposing new species that already exists results in no added species, and a toast message warning.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
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

  await user.type(firstFishNameInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByRole('button', {
    name: 'Propose New Species...',
  })

  await user.click(noResultsButton)

  const modal = screen.getByTestId('attribute-proposal-modal')

  const genusInput = await within(modal).findByTestId('attribute-label')
  const speciesInput = within(modal).getByTestId('new-attribute-name')

  await user.type(genusInput, 'holo')

  const genusAutocompleteList = within(modal).getByRole('listbox')

  const hologymnosusOption = within(modal).getByRole('option', {
    name: 'Hologymnosus',
  })

  await user.selectOptions(genusAutocompleteList, hologymnosusOption)

  // note uppercase first letter. Species names must be transformed to lowercase
  await user.type(speciesInput, 'Longipes')

  const nextScreenButton = within(modal).getByTestId('next-form-page')

  await user.click(nextScreenButton)

  const submitButton = within(modal).getByTestId('submit-proposal-button')

  await user.click(submitButton)

  expect(screen.queryByTestId('attribute-proposal-modal')).not.toBeInTheDocument()
  const fishbeltFormAfterSubmit = screen.getByRole('form')

  // input display value is updated with *existing* species selected
  expect(await within(fishbeltFormAfterSubmit).findByDisplayValue('Hologymnosus longipes'))

  // Expect duplicate message toast popup

  const speciesInOfflineStorageCountAfterRedundantNewSpeciesSubmit = (
    await dexiePerUserDataInstance.fish_species.toArray()
  ).length

  const isSpeciesInOfflineStorageUnchanged =
    speciesInOfflineStorageCountAfterRedundantNewSpeciesSubmit === speciesInOfflineStorageCount

  expect(isSpeciesInOfflineStorageUnchanged).toBeTruthy()
})
