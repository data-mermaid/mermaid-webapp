import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockBenthicPitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicPitCollectRecords'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API
const ACROPORA_ID = 'acropora-0000-0000-0000-000000000000'

const [benthicPitRecord] = mockBenthicPitCollectRecords
const [firstObservation, ...otherObservations] = benthicPitRecord.data.obs_benthic_pits

// The first row is not coral but carries a status, the fourth is a bleached coral and the fifth
// a coral with no status. The results are the ones the API returns for that record.
const recordWithBleachingResults = {
  ...benthicPitRecord,
  data: {
    ...benthicPitRecord.data,
    include_bleaching: true,
    obs_benthic_pits: [
      { ...firstObservation, bleaching_status: 2 },
      ...otherObservations,
      { id: '4', interval: '6', attribute: ACROPORA_ID, growth_form: '', bleaching_status: 1 },
      { id: '5', interval: '7', attribute: ACROPORA_ID, growth_form: '', bleaching_status: null },
    ],
  },
  validations: {
    status: 'error',
    results: {
      $record: [
        {
          code: 'missing_bleaching_status',
          name: 'bleaching_status_missing_validator',
          fields: ['data.obs_benthic_pits'],
          status: 'warning',
          validation_id: 'missing-bleaching-status',
          context: { count: 1 },
        },
      ],
      data: {
        include_bleaching: [
          {
            code: 'include_bleaching_required',
            name: 'include_bleaching_validator',
            fields: ['data.include_bleaching'],
            status: 'error',
            validation_id: 'include-bleaching',
            context: null,
          },
        ],
        obs_benthic_pits: [
          [
            {
              code: 'bleaching_status_not_coral',
              name: 'bleaching_status_validator',
              fields: ['data.obs_benthic_pits'],
              status: 'error',
              validation_id: 'bleaching-status',
              context: { observation_id: firstObservation.id },
            },
          ],
        ],
      },
    },
  },
}

const renderRecordWithBleachingResults = () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/pull/`, () =>
      HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [recordWithBleachingResults] },
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

  return renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/projects/5/collecting/benthicpit/50'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )
}

test('Bleaching validation messages show at the field, on the row, and under the observations heading', async () => {
  renderRecordWithBleachingResults()

  const field = await screen.findByTestId('include-bleaching', {}, { timeout: 10000 })

  expect(await within(field).findByText('validation_messages.required')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-section')).getByText(
      'validation_messages.bleaching_status_not_coral',
    ),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-heading-validations')).getByText(
      'validation_messages.missing_bleaching_status',
    ),
  ).toBeInTheDocument()
  expect(screen.queryByText('validations.edited_revalidate')).not.toBeInTheDocument()
}, 50000)

test('Confirming No marks the bleaching messages on the field and the row as edited since the last Validate', async () => {
  const { user } = renderRecordWithBleachingResults()

  const field = await screen.findByTestId('include-bleaching', {}, { timeout: 10000 })

  await within(field).findByText('validation_messages.required')
  await user.selectOptions(screen.getByTestId('include-bleaching-select'), 'false')
  await user.click(await screen.findByTestId('turn-off-bleaching-confirm'))

  expect(await within(field).findByText('validations.edited_revalidate')).toBeInTheDocument()
  expect(
    await within(screen.getByTestId('observations-section')).findByText(
      'validations.edited_revalidate',
    ),
  ).toBeInTheDocument()
}, 50000)
