import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBleachingCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'
import mockBleachingValidationsObject from '../../../../testUtilities/mockBleachingValidationsObject'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Edit Bleaching collect record - Save button starts with Saved status, make changes, Saved change to Saving, and finally to Saved. Validate button is disabled during saving', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.clear(await screen.findByLabelText('Depth'))
  await user.type(screen.getByLabelText('Depth'), '45')

  expect(screen.getByText('Save', { selector: 'button' }))

  expect(screen.getByText('Validate', { selector: 'button' })).toBeDisabled()

  await user.click(
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

test('Validate Bleaching collect record: fails to validate, shows button able to run validation again.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.click(await screen.findByText('Validate', { selector: 'button' }))

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
        validations: mockBleachingValidationsObject, // fails validation
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

test('Validate & submit Bleaching collect record: validation passes, shows validate button disabled with proper text, submit is enabled. On submit, submit button is disabled and has "submitting" text', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidationFailing = {
        ...mockBleachingCollectRecords[0],
        validations: mockBleachingValidationsObject, // fails validation
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
        ...mockBleachingCollectRecords[0],
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

  expect(await screen.findByText('Validating', { selector: 'button' }))

  expect(await screen.findByText('Validated', { selector: 'button' }))
  expect(
    screen.queryByText('Validation is currently unavailable for this record.'),
  ).not.toBeInTheDocument()

  expect(await screen.findByText('Submit', { selector: 'button' })).toBeEnabled()

  await user.click(await screen.findByText('Submit', { selector: 'button' }))

  expect(await screen.findByText('Submitting', { selector: 'button' })).toBeDisabled()
})

test('Initial load of successfully validated record', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.click(await screen.findByText('Validate', { selector: 'button' }))

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
