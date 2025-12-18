import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockBenthicLitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'
import mockBenthicLitValidationsObject from '../../../../testUtilities/mockCollectRecords/mockBenthicLitValidationsObject'
import App from '../../../App'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Edit Benthic LIT - Save button starts with Saved status, make changes, Saved change to Saving, and finally to Saved. Validate button is disabled during saving', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.clear(await screen.findByLabelText('Depth'))
  await user.type(screen.getByLabelText('Depth'), '45')

  expect(screen.getByTestId('save-button'))

  expect(screen.getByTestId('validate-button')).toBeDisabled()

  await user.click(screen.getByTestId('save-button'))

  expect(await screen.findByTestId('saving-button'))


  expect(await screen.findByTestId('saved-button'))
  expect(screen.getByTestId('validate-button')).toBeEnabled()
  expect(screen.getByTestId('submit-button')).toBeDisabled()
})

test('Validate Benthic LIT: fails to validate, shows button able to run validation again.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.click(await screen.findByTestId('validate-button'))

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicLitCollectRecords[0],
        validations: mockBenthicLitValidationsObject, // fails validation
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return res(ctx.json(response))
    }),
  )

  expect(await screen.findByTestId('validating-button'))

  expect(await screen.findByTestId('validate-button'))
  expect(
    screen.queryByText('Validation is currently unavailable for this record.'),
  ).not.toBeInTheDocument()
})

test('Validate & submit Benthic LIT: validation passes, shows validate button disabled with proper text, submit is enabled. On submit, submit button is disabled and has "submitting" text', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidationFailing = {
        ...mockBenthicLitCollectRecords[0],
        validations: mockBenthicLitValidationsObject, // fails validation
      }

      const firstPullResponse = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidationFailing] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return res.once(ctx.json(firstPullResponse))
    }),
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidationOk = {
        ...mockBenthicLitCollectRecords[0],
        validations: { status: 'ok' },
      }

      const secondPullResponse = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidationOk] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return res.once(ctx.json(secondPullResponse))
    }),
  )

  await user.click(await screen.findByTestId('validate-button'))

  expect(await screen.findByTestId('validating-button'))

  expect(await screen.findByTestId('validated-button'))
  expect(
    screen.queryByText('Validation is currently unavailable for this record.'),
  ).not.toBeInTheDocument()

  expect(await screen.findByTestId('submit-button')).toBeEnabled()

  await user.click(await screen.findByTestId('submit-button'))

  expect(await screen.findByTestId('submitting-button')).toBeDisabled()
})

test('Initial load of successfully validated record', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.click(await screen.findByTestId('validate-button'))

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicLitCollectRecords[0],
        validations: { status: 'ok' },
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return res(ctx.json(response))
    }),
  )

  expect(await screen.findByTestId('saved-button')).toBeDisabled()
  expect(await screen.findByTestId('validated-button')).toBeDisabled()
  expect(await screen.findByTestId('submit-button')).toBeEnabled()
})
