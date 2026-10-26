import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// Results as the API stores them after a Validate, from Collect or from mermaidr
const storedResults = {
  data: {
    obs_belt_fishes: [
      [
        {
          code: 'stored observation warning',
          status: 'warning',
          validation_id: 'stored-observation-warning',
          context: { observation_id: '7' },
        },
        {
          code: 'stored observation ignore',
          status: 'ignore',
          validation_id: 'stored-observation-ignore',
          context: { observation_id: '7' },
        },
      ],
    ],
    sample_event: {
      site: [{ code: 'stored site error', status: 'error', validation_id: 'stored-site-error' }],
    },
  },
}

const mockPullWithValidations = (validations) =>
  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/pull/`, () =>
      HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [{ ...mockMermaidData.collect_records[0], validations }] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }),
    ),
  )

const renderRecord = () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  return renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/projects/5/collecting/fishbelt/1'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )
}

test('Opening a record with stored errors, warnings, and ignores shows them all without a Validate click', async () => {
  mockPullWithValidations({ status: 'error', results: storedResults })

  renderRecord()

  const site = await screen.findByTestId('site', {}, { timeout: 10000 })

  expect(await within(site).findByText('stored site error')).toBeInTheDocument()

  const observationsTable = screen.getByTestId('observations-section')

  expect(within(observationsTable).getByText('stored observation warning')).toBeInTheDocument()
  expect(within(observationsTable).getByText('stored observation ignore')).toBeInTheDocument()
  expect(screen.getByText('sample_units.errors.submit_disabled')).toBeInTheDocument()
  expect(screen.getByTestId('validate-button')).toBeEnabled()
}, 50000)

test('Opening a record with stored ok validations shows its ignored items', async () => {
  mockPullWithValidations({
    status: 'ok',
    results: { data: { obs_belt_fishes: [[storedResults.data.obs_belt_fishes[0][1]]] } },
  })

  renderRecord()

  const observationsTable = await screen.findByTestId(
    'observations-section',
    {},
    { timeout: 10000 },
  )

  // A row with only ignored validations shows the Ignored label, not the validation message
  expect(await within(observationsTable).findByTestId('ignore-warning-label')).toBeInTheDocument()
  expect(screen.getByTestId('validated-button')).toBeDisabled()
}, 50000)

test('Opening a record whose validations are stale shows none of them', async () => {
  mockPullWithValidations({ status: 'stale', results: storedResults })

  renderRecord()

  expect(await screen.findByTestId('validate-button', {}, { timeout: 10000 })).toBeEnabled()
  expect(screen.queryByText('stored site error')).not.toBeInTheDocument()
  expect(screen.queryByText('stored observation warning')).not.toBeInTheDocument()
  expect(screen.queryByText('stored observation ignore')).not.toBeInTheDocument()
}, 50000)

test('Saving a record opened with stored validations hides them until the next Validate', async () => {
  mockPullWithValidations({ status: 'error', results: storedResults })

  const { user } = renderRecord()

  expect(await screen.findByText('stored site error', {}, { timeout: 10000 })).toBeInTheDocument()

  await user.clear(screen.getByTestId('depth-input'))
  await user.type(screen.getByTestId('depth-input'), '45')
  await user.click(screen.getByTestId('save-button'))

  expect(await screen.findByTestId('saved-button')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByText('stored site error')).not.toBeInTheDocument())
  expect(screen.queryByText('stored observation warning')).not.toBeInTheDocument()
}, 50000)
