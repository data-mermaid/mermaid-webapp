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
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'

test('Benthic PIT observations add new benthic attribute - filling out new attribute form adds a new attribute to dexie and the observation benthic attribute input', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/50'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // loading indicator is weird in integration tests, so we wait for the page title
  await screen.findByTestId('edit-collect-record-form-title')

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/pull/`,

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

  userEvent.type(firstBenthicAttributeInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByRole('button', {
    name: 'Propose New Benthic Attribute...',
  })

  userEvent.click(noResultsButton)

  const modal = screen.getByLabelText('Add New Benthic Attribute')

  const parentInput = await within(modal).findByLabelText('Parent')
  const nameInput = within(modal).getByLabelText('Name')

  userEvent.type(parentInput, 'Dead')

  const parentAutocompleteList = within(modal).getByRole('listbox')

  const deadCoralOption = within(modal).getByRole('option', {
    name: 'Dead Coral with Algae',
  })

  userEvent.selectOptions(parentAutocompleteList, deadCoralOption)

  userEvent.type(nameInput, 'unicorn')

  const nextScreenButton = within(modal).getByRole('button', {
    name: 'Next',
  })

  userEvent.click(nextScreenButton)

  expect(
    await within(modal).findByText(
      'Your proposed new benthic attribute will be reviewed by the MERMAID team. They will either approve it for inclusion in the taxonomy or contact you to follow up.',
    ),
  )

  const benthicAttributeElement = within(modal).getByLabelText('Benthic Attribute')
  const userNameElement = within(modal).getByLabelText('User')
  const projectNameElement = within(modal).getByLabelText('Project')

  expect(within(userNameElement).getByText('FakeFirstNameOnline FakeLastNameOnline'))
  expect(within(projectNameElement).getByText('Project V'))
  expect(within(benthicAttributeElement).getByText('unicorn'))

  const submitButton = within(modal).getByRole('button', {
    name: 'Send to MERMAID for review',
  })

  userEvent.click(submitButton)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('Add New Benthic Attribute'))
  const benthicPitFormAfterSubmit = screen.getByRole('form')

  expect(await within(benthicPitFormAfterSubmit).findByDisplayValue('unicorn'))

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

test('Benthic PIT observations add new benthic attribute - proposing new attribute that already exists results in no added attribute, and a toast message warning.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/50'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

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

  userEvent.type(firstBenthicAttributeInput, 'supercalifragilistic')

  const noResultsButton = await screen.findByRole('button', {
    name: 'Propose New Benthic Attribute...',
  })

  userEvent.click(noResultsButton)

  const modal = screen.getByLabelText('Add New Benthic Attribute')

  const parentInput = await within(modal).findByLabelText('Parent')
  const nameInput = within(modal).getByLabelText('Name')

  userEvent.type(parentInput, 'Dead')

  const parentAutocompleteList = within(modal).getByRole('listbox')

  const deadCoralOption = within(modal).getByRole('option', {
    name: 'Dead Coral with Algae',
  })

  userEvent.selectOptions(parentAutocompleteList, deadCoralOption)

  userEvent.type(nameInput, 'Zosteraceae')

  const nextScreenButton = await within(modal).findByRole('button', {
    name: 'Next',
  })

  userEvent.click(nextScreenButton)

  const submitButton = await within(modal).findByRole('button', {
    name: 'Send to MERMAID for review',
  })

  userEvent.click(submitButton)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('Add New Benthic Attribute'))
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