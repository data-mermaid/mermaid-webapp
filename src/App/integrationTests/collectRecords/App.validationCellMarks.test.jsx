import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { http, HttpResponse } from 'msw'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import mockMermaidData from '../../../testUtilities/mockMermaidData'
import mockBeltInvertCollectRecords from '../../../testUtilities/mockCollectRecords/mockBeltInvertCollectRecords'
import mockBenthicLitCollectRecords from '../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'
import mockBenthicPhotoQuadratCollectRecords from '../../../testUtilities/mockCollectRecords/mockBenthicPhotoQuadratCollectRecords'
import mockBenthicPitCollectRecords from '../../../testUtilities/mockCollectRecords/mockBenthicPitCollectRecords'
import mockBleachingCollectRecords from '../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'
import mockFishbeltCollectRecords from '../../../testUtilities/mockCollectRecords/mockFishbeltCollectRecords'
import mockHabitatComplexityCollectRecords from '../../../testUtilities/mockCollectRecords/mockHabitatComplexityCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// Each case gives one observation row a single message and names, by the aria-labelledby of the
// cell or of the input inside it, the cells that message should mark.
const cases = [
  {
    protocol: 'fishbelt',
    record: mockFishbeltCollectRecords[0],
    observationsKey: 'obs_belt_fishes',
    observationId: '9',
    validation: { status: 'error', code: 'invalid_fish_count' },
    markedLabels: ['fish-count-label'],
  },
  {
    protocol: 'macroinvertebrate',
    record: mockBeltInvertCollectRecords[0],
    observationsKey: 'obs_belt_inverts',
    observationId: '7',
    validation: { status: 'warning', code: 'invert_count_high' },
    markedLabels: ['invert-count-label'],
  },
  {
    protocol: 'benthiclit',
    record: mockBenthicLitCollectRecords[0],
    observationsKey: 'obs_benthic_lits',
    observationId: '1',
    validation: { status: 'error', code: 'required', name: 'length_list_required_validator' },
    markedLabels: ['length-label'],
  },
  {
    protocol: 'benthicpit',
    record: mockBenthicPitCollectRecords[0],
    observationsKey: 'obs_benthic_pits',
    observationId: '1',
    validation: { status: 'error', code: 'required', name: 'interval_list_required_validator' },
    markedLabels: ['interval-label'],
  },
  {
    protocol: 'benthicpqt',
    record: mockBenthicPhotoQuadratCollectRecords[0],
    observationsKey: 'obs_benthic_photo_quadrats',
    observationId: '1',
    validation: { status: 'error', code: 'required', name: 'num_points_list_required_validator' },
    markedLabels: ['number-of-points-label'],
  },
  {
    protocol: 'habitatcomplexity',
    record: mockHabitatComplexityCollectRecords[0],
    observationsKey: 'obs_habitat_complexities',
    observationId: '1',
    validation: { status: 'error', code: 'invalid_score' },
    markedLabels: ['habitat-complexity-score-label'],
  },
  {
    protocol: 'bleachingqc',
    record: mockBleachingCollectRecords[0],
    observationsKey: 'obs_colonies_bleached',
    observationId: '1',
    validation: {
      status: 'error',
      code: 'invalid_count',
      context: { invalid_paths: ['count_pale'] },
    },
    markedLabels: ['pale-label'],
  },
  {
    protocol: 'bleachingqc',
    record: mockBleachingCollectRecords[0],
    observationsKey: 'obs_quadrat_benthic_percent',
    tableTestId: 'observations2-section',
    observationId: '1',
    validation: { status: 'error', code: 'invalid_total' },
    markedLabels: [
      'hard-coral-percent-cover-label',
      'soft-coral-percent-cover-label',
      'microalgae-percent-cover-label',
    ],
  },
]

const getMarkedLabels = (row) =>
  [...row.querySelectorAll(':scope > td[data-validation-mark]')].map(
    (cell) =>
      cell.getAttribute('aria-labelledby') ??
      cell.querySelector('[aria-labelledby]').getAttribute('aria-labelledby'),
  )

test.each(cases)(
  '$protocol $observationsKey marks the cell a $validation.code message is about',
  async ({
    protocol,
    record,
    observationsKey,
    observationId,
    validation,
    markedLabels,
    tableTestId = 'observations-section',
  }) => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const recordWithValidation = {
      ...record,
      validations: {
        status: validation.status,
        results: {
          data: {
            [observationsKey]: [
              [
                {
                  validation_id: 'cell-mark',
                  ...validation,
                  context: { observation_id: observationId, ...validation.context },
                },
              ],
            ],
          },
        },
      },
    }

    mockMermaidApiAllSuccessful.use(
      http.post(`${apiBaseUrl}/pull/`, () =>
        HttpResponse.json({
          benthic_attributes: { updates: mockMermaidData.benthic_attributes },
          invert_attributes: { updates: mockMermaidData.invert_attributes },
          choices: { updates: mockMermaidData.choices },
          collect_records: { updates: [recordWithValidation] },
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

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      { initialEntries: [`/projects/5/collecting/${protocol}/${record.id}`] },
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    )

    await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
    expect(await screen.findByTestId('validate-button')).toBeInTheDocument()

    const table = await screen.findByTestId(tableTestId)
    const row = await waitFor(() => {
      const observationRow = table.querySelector(`tr[data-observation-id="${observationId}"]`)

      expect(observationRow.querySelector('td[data-validation-mark]')).not.toBeNull()

      return observationRow
    })

    expect(getMarkedLabels(row)).toEqual(markedLabels)
    row
      .querySelectorAll(':scope > td[data-validation-mark]')
      .forEach((cell) => expect(cell).toHaveAttribute('data-validation-mark', validation.status))
  },
  60000,
)
