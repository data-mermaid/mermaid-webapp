import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

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

test('Bleaching collect record observations add new benthic attribute - filling out new attribute form adds a new attribute to dexie and the observation benthic attribute input', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
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
            benthic_attributes: {
              updates: [
                {
                  id: 'whatever',
                  name: 'unicorn',
                },
              ],
            },
          }),
        )
      },
    ),
  )

  const form = screen.getByRole('form')
  const observationsTable = (await within(form).findAllByRole('table'))[0]

  const firstBenthicAttributeInput =
    within(observationsTable).getAllByDisplayValue('Dead Coral with Algae')[0]

  await user.type(firstBenthicAttributeInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByRole('button', {
    name: 'Propose New Benthic Attribute...',
  })

  await user.click(noResultsButton)

  const modal = screen.getByTestId('attribute-proposal-modal')

  const parentInput = await within(modal).findByTestId('attribute-label')
  const nameInput = within(modal).getByTestId('new-attribute-name')

  await user.type(parentInput, 'Dead')

  const parentAutocompleteList = within(modal).getByRole('listbox')

  const deadCoralOption = within(modal).getByRole('option', {
    name: 'Dead Coral with Algae',
  })

  await user.selectOptions(parentAutocompleteList, deadCoralOption)

  await user.type(nameInput, 'unicorn')

  const nextScreenButton = within(modal).getByTestId('next-form-page')

  await user.click(nextScreenButton)

  expect(await within(modal).findByTestId('proposed-summary'))

  const benthicAttributeElement = within(modal).getByTestId('proposed-attribute-type')
  const userNameElement = within(modal).getByTestId('proposed-attribute-user')
  const projectNameElement = within(modal).getByTestId('proposed-attribute-project')

  expect(within(userNameElement).getByText('W-FakeFirstNameOnline W-FakeLastNameOnline'))
  expect(within(projectNameElement).getByText('Project V'))
  expect(within(benthicAttributeElement).getByText('Dead Coral with Algae unicorn'))

  const submitButton = within(modal).getByTestId('submit-proposal-button')

  await user.click(submitButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('attribute-proposal-modal'))
  const benthicPitFormAfterSubmit = screen.getByRole('form')

  expect(await within(benthicPitFormAfterSubmit).findByDisplayValue('unicorn'))

  //expect success message toast

  const updtedBenthicAttributesInStorate =
    await dexiePerUserDataInstance.benthic_attributes.toArray()

  const newBenthicAttribute = updtedBenthicAttributesInStorate.find(
    (attribute) => attribute.name === 'unicorn',
  )

  expect(newBenthicAttribute).toBeTruthy()
})

test('Bleaching collect record observations add new benthic attribute - proposing new attribute that already exists results in no added attribute, and a toast message warning.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  // loading indicator is weird in integration tests, so we wait for the page title

  await screen.findByTestId('edit-collect-record-form-title')

  const form = screen.getByRole('form')
  const observationsTable = (await within(form).findAllByRole('table'))[0]

  // need to wait until app loaded and offline storage hydration before getting species count
  const attributesInOfflineStorageCount = (
    await dexiePerUserDataInstance.benthic_attributes.toArray()
  ).length

  expect(attributesInOfflineStorageCount).toEqual(2)

  const firstBenthicAttributeInput =
    within(observationsTable).getAllByDisplayValue('Dead Coral with Algae')[0]

  await user.type(firstBenthicAttributeInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByRole('button', {
    name: 'Propose New Benthic Attribute...',
  })

  await user.click(noResultsButton)

  const modal = screen.getByTestId('attribute-proposal-modal')

  const parentInput = await within(modal).findByTestId('attribute-label')
  const nameInput = within(modal).getByTestId('new-attribute-name')

  await user.type(parentInput, 'Dead')

  const parentAutocompleteList = within(modal).getByRole('listbox')

  const deadCoralOption = within(modal).getByRole('option', {
    name: 'Dead Coral with Algae',
  })

  await user.selectOptions(parentAutocompleteList, deadCoralOption)

  await user.type(nameInput, 'Zosteraceae')

  const nextScreenButton = within(modal).getByTestId('next-form-page')

  await user.click(nextScreenButton)

  const submitButton = within(modal).getByTestId('submit-proposal-button')

  await user.click(submitButton)

  await waitFor(() =>
    expect(screen.queryByTestId('attribute-proposal-modal')).not.toBeInTheDocument(),
  )

  //expect duplicate message toast

  const formAfterProposedAttribute = screen.getByRole('form')

  // input display value is updated with *existing* attribute proposed
  expect(await within(formAfterProposedAttribute).findByDisplayValue('Zosteraceae'))

  const benthicAttributesInOfflineStorageCountAfterRedundantNewAttributeSubmit = (
    await dexiePerUserDataInstance.benthic_attributes.toArray()
  ).length

  const isBenthicAttributesInofflineStorageCountUnchanged =
    benthicAttributesInOfflineStorageCountAfterRedundantNewAttributeSubmit ===
    attributesInOfflineStorageCount

  expect(isBenthicAttributesInofflineStorageCountUnchanged).toBeTruthy()
})
