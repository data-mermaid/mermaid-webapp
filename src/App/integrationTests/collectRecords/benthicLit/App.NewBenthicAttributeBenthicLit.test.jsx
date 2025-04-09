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

test('Benthic LIT observations add new benthic attribute - filling out new attribute form adds a new attribute to dexie and the observation benthic attribute input', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
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

  const modal = screen.getByLabelText('Add New Benthic Attribute')

  const parentInput = await within(modal).findByLabelText('Parent')
  const nameInput = within(modal).getByLabelText('Name')

  await user.type(parentInput, 'Dead')

  const parentAutocompleteList = within(modal).getByRole('listbox')

  const deadCoralOption = within(modal).getByRole('option', {
    name: 'Dead Coral with Algae',
  })

  await user.selectOptions(parentAutocompleteList, deadCoralOption)

  await user.type(nameInput, 'unicorn')

  const nextScreenButton = within(modal).getByRole('button', {
    name: 'Next',
  })

  await user.click(nextScreenButton)

  expect(
    await within(modal).findByText(
      'Your proposed new benthic attribute will be reviewed by the MERMAID team. They will either approve it for inclusion in the taxonomy or contact you to follow up.',
    ),
  )

  const benthicAttributeElement = within(modal).getByLabelText('Benthic Attribute')
  const userNameElement = within(modal).getByLabelText('User')
  const projectNameElement = within(modal).getByLabelText('Project')

  expect(within(userNameElement).getByText('W-FakeFirstNameOnline W-FakeLastNameOnline'))
  expect(within(projectNameElement).getByText('Project V'))
  expect(within(benthicAttributeElement).getByText('Dead Coral with Algae unicorn'))

  const submitButton = within(modal).getByRole('button', {
    name: 'Send to MERMAID for review',
  })

  await user.click(submitButton)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('Add New Benthic Attribute'))
  const benthicLitFormAfterSubmit = screen.getByRole('form')

  expect(await within(benthicLitFormAfterSubmit).findByDisplayValue('unicorn'))

  const proposedBenthicAttributeToast = await screen.findByText(
    'Proposed benthic benthic attribute saved. The observation has been edited to show it selected.',
  )

  expect(proposedBenthicAttributeToast).toBeInTheDocument()

  const updtedBenthicAttributesInStorate =
    await dexiePerUserDataInstance.benthic_attributes.toArray()

  const newBenthicAttribute = updtedBenthicAttributesInStorate.find(
    (attribute) => attribute.name === 'unicorn',
  )

  expect(newBenthicAttribute).toBeTruthy()
})

test('Benthic LIT observations add new benthic attribute - proposing new attribute that already exists results in no added attribute, and a toast message warning.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
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

  const modal = screen.getByLabelText('Add New Benthic Attribute')

  const parentInput = await within(modal).findByLabelText('Parent')
  const nameInput = within(modal).getByLabelText('Name')

  await user.type(parentInput, 'Dead')

  const parentAutocompleteList = within(modal).getByRole('listbox')

  const deadCoralOption = within(modal).getByRole('option', {
    name: 'Dead Coral with Algae',
  })

  await user.selectOptions(parentAutocompleteList, deadCoralOption)

  await user.type(nameInput, 'Zosteraceae')

  const nextScreenButton = await within(modal).findByRole('button', {
    name: 'Next',
  })

  await user.click(nextScreenButton)

  const submitButton = await within(modal).findByRole('button', {
    name: 'Send to MERMAID for review',
  })

  expect(screen.getByLabelText('Add New Benthic Attribute'))
  await user.click(submitButton)

  await waitFor(() =>
    expect(screen.queryByLabelText('Add New Benthic Attribute')).not.toBeInTheDocument(),
  )
  const proposedBenthicAttributeDuplicateToast = await screen.findByText(
    'The proposed benthic attribute already exists in the list. The observation has been edited to show the existing benthic attribute selected.',
  )

  expect(proposedBenthicAttributeDuplicateToast).toBeInTheDocument()

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
