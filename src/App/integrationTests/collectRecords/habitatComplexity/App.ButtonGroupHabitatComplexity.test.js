import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOnline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import App from '../../../App'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockHabitatComplexityCollectRecords from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityCollectRecords'
import mockHabitatComplexityValidationsObject from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityValidationsObject'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Edit Habitat Complexity - Save button starts with Saved status, make changes, Saved change to Saving, and finally to Saved. Validate button is disabled during saving', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  userEvent.clear(await screen.findByLabelText('Depth'))
  userEvent.type(screen.getByLabelText('Depth'), '45')

  expect(screen.getByText('Save', { selector: 'button' }))

  expect(screen.getByText('Validate', { selector: 'button' })).toBeDisabled()

  userEvent.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('Saving', { selector: 'button' }))

  expect(await screen.findByText('Record saved.'))

  expect(await screen.findByText('Saved', { selector: 'button' }))
  expect(screen.getByText('Validate', { selector: 'button' })).toBeEnabled()
  expect(screen.getByText('Submit', { selector: 'button' })).toBeDisabled()
})

test('Validate Habitat Complexity: fails to validate, shows button able to run validation again.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  userEvent.click(await screen.findByText('Validate', { selector: 'button' }))

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockHabitatComplexityValidationsObject, // fails validation
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

  expect(await screen.findByText('Validating', { selector: 'button' }))

  expect(await screen.findByText('Validate', { selector: 'button' }))
  expect(
    screen.queryByText('Validation is currently unavailable for this record.'),
  ).not.toBeInTheDocument()
})

test('Validate & submit Habitat Complexity: validation passes, shows validate button disabled with proper text, submit is enabled. On submit, submit button is disabled and has "submitting" text', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidationFailing = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockHabitatComplexityValidationsObject, // fails validation
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
        ...mockHabitatComplexityCollectRecords[0],
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

  userEvent.click(await screen.findByText('Validate', { selector: 'button' }))

  expect(await screen.findByText('Validating', { selector: 'button' }))

  expect(await screen.findByText('Validated', { selector: 'button' }))
  expect(
    screen.queryByText('Validation is currently unavailable for this record.'),
  ).not.toBeInTheDocument()

  expect(await screen.findByText('Submit', { selector: 'button' })).toBeEnabled()

  userEvent.click(await screen.findByText('Submit', { selector: 'button' }))

  expect(await screen.findByText('Submitting', { selector: 'button' })).toBeDisabled()
})

test('Initial load of successfully validated record', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  userEvent.click(await screen.findByText('Validate', { selector: 'button' }))

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
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

  expect(await screen.findByText('Saved', { selector: 'button' })).toBeDisabled()
  expect(await screen.findByText('Validated', { selector: 'button' })).toBeDisabled()
  expect(await screen.findByText('Submit', { selector: 'button' })).toBeEnabled()
})
