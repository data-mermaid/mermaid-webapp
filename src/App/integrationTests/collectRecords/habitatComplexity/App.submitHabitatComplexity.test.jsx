import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockHabitatComplexityCollectRecords from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityCollectRecords'
import mockHabitatComplexityValidationsObject from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityValidationsObject'
import App from '../../../App'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Submit Habitat Complexity success shows toast message and redirects to collect record list page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

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

  await user.click(await screen.findByText('Validate', { selector: 'button' }))
  expect(await screen.findByText('Validated', { selector: 'button' }))

  await user.click(await screen.findByText('Submit', { selector: 'button' }))

  expect(await screen.findByText('Record submitted.'))
  expect(await screen.findByTestId('collecting-title'))

  // we dont test that the record is removed from dexie becuase that is the responsibility
  // of sync + the api.Post submit pulls updates and deletes.
})

test('Submit Habitat Complexity failure shows toast message and an enabled submit button', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

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
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/submit/`, (req, res, ctx) => {
      return res(ctx.status(400))
    }),
  )

  await user.click(await screen.findByText('Validate', { selector: 'button' }))
  expect(await screen.findByText('Validated', { selector: 'button' })) // just to make act errors silence
  await user.click(await screen.findByText('Submit', { selector: 'button' }))
  expect(await screen.findByText('Submitting', { selector: 'button' }))

  expect(await screen.findByText('The sample unit has not been submitted.'))
  expect(await screen.findByText('Submit', { selector: 'button' })).toBeEnabled()
  expect(await screen.findByText('Validated', { selector: 'button' })).toBeDisabled()
  expect(await screen.findByText('Saved', { selector: 'button' })).toBeDisabled()
})
