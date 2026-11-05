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
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import mockMermaidData from '../../../testUtilities/mockMermaidData'
import mockBleachingCollectRecords from '../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const duplicateTransect = {
  code: 'duplicate_transect',
  status: 'error',
  validation_id: 'duplicate-transect',
  fields: ['data.sample_event.site', 'data.fishbelt_transect.number'],
}

const renderValidatedRecord = async ({ record, path, $record }) => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () =>
      HttpResponse.json({}, { status: 200 }),
    ),
    http.post(`${apiBaseUrl}/pull/`, () =>
      HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: {
          updates: [{ ...record, validations: { status: 'error', results: { $record } } }],
        },
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
    { initialEntries: [path] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  return { user }
}

test('A fish belt table validation shows under the Observations heading and can be ignored there', async () => {
  const { user } = await renderValidatedRecord({
    record: mockMermaidData.collect_records[0],
    path: '/projects/5/collecting/fishbelt/1',
    $record: [
      duplicateTransect,
      {
        code: 'too_few_observations',
        status: 'warning',
        validation_id: 'too-few',
        fields: ['data.obs_belt_fishes'],
        context: { observation_count_range: [5, 200] },
      },
    ],
  })

  const underHeading = within(screen.getByTestId('observations-section')).getByTestId(
    'observations-heading-validations',
  )
  const top = screen.getByTestId('record-level-validations')

  expect(within(underHeading).getAllByRole('listitem')).toHaveLength(1)
  expect(underHeading.querySelector('[data-record-validation-id="too-few"]')).toBeInTheDocument()
  expect(within(top).getAllByRole('listitem')).toHaveLength(1)
  expect(top.querySelector('[data-record-validation-id="duplicate-transect"]')).toBeInTheDocument()

  await user.click(within(underHeading).getByTestId('ignore-warning-checkbox'))

  expect(await within(underHeading).findByTestId('message-pill-ignore')).toBeInTheDocument()
}, 50000)

test('Each bleaching table validation shows under the heading of the table it names', async () => {
  await renderValidatedRecord({
    record: mockBleachingCollectRecords[0],
    path: '/projects/5/collecting/bleachingqc/60',
    $record: [
      {
        code: 'all_equal',
        status: 'warning',
        validation_id: 'colonies-warning',
        fields: ['data.obs_colonies_bleached'],
      },
      {
        code: 'all_equal',
        status: 'warning',
        validation_id: 'percent-cover-warning',
        fields: ['data.obs_quadrat_benthic_percent'],
      },
    ],
  })

  const coloniesHeading = within(screen.getByTestId('observations-section')).getByTestId(
    'observations-heading-validations',
  )
  const percentCoverHeading = within(screen.getByTestId('observations2-section')).getByTestId(
    'observations-heading-validations',
  )

  expect(
    coloniesHeading.querySelector('[data-record-validation-id="colonies-warning"]'),
  ).toBeInTheDocument()
  expect(within(coloniesHeading).getAllByRole('listitem')).toHaveLength(1)
  expect(
    percentCoverHeading.querySelector('[data-record-validation-id="percent-cover-warning"]'),
  ).toBeInTheDocument()
  expect(within(percentCoverHeading).getAllByRole('listitem')).toHaveLength(1)
  expect(
    within(screen.getByTestId('record-level-validations')).queryAllByRole('listitem'),
  ).toHaveLength(0)
}, 50000)
