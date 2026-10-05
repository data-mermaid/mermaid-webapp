import { expect, test, vi } from 'vitest'
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
import { mockT } from '../../../../testUtilities/mockT'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// The react-i18next mock returns the key, so the rendered chip never contains its count.
// Read the count out of the most recent translation call for that chip instead.
const getChipCount = (variant) => {
  const chipCalls = mockT.mock.calls.filter(
    ([key]) => key === `sample_units.validation_status.chip_label_${variant}`,
  )

  return chipCalls.at(-1)?.[1]?.count
}

const renderFishBeltAndValidate = async (validations) => {
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
          updates: [{ ...mockMermaidData.collect_records[0], validations }],
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
    { initialEntries: ['/projects/5/collecting/fishbelt/1'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  expect(await screen.findByTestId('form-status-indicators')).toBeInTheDocument()

  return { user }
}

// One validation of each kind, so the expected chip totals are unambiguous:
// errors = depth field + observation 7, warnings = length surveyed field + record level.
const oneValidationPerRow = {
  status: 'error',
  results: {
    $record: [{ code: 'all_equal', status: 'warning', validation_id: 'record-level-warning' }],
    data: {
      fishbelt_transect: {
        depth: [{ code: 'required', status: 'error', validation_id: 'depth-error' }],
        len_surveyed: [
          {
            code: 'len_surveyed_out_of_range',
            status: 'warning',
            validation_id: 'len-surveyed-warning',
          },
        ],
      },
      obs_belt_fishes: [
        [
          {
            code: 'required',
            status: 'error',
            validation_id: 'observation-error',
            context: { observation_id: '7' },
          },
        ],
      ],
    },
  },
}

// Three separate warnings, all on observation 7, so the row shows three messages.
const threeWarningsOnOneRow = {
  status: 'error',
  results: {
    data: {
      obs_belt_fishes: [
        ['max_fish_size', 'not_part_of_fish_family_subset', 'similar_name'].map((code) => ({
          code,
          status: 'warning',
          validation_id: `${code}-warning`,
          context: { observation_id: '7' },
        })),
      ],
    },
  },
}

// This pins the end-to-end totals: what the chips say against a known payload, and that
// editing an input takes its validation out of the count. It does not isolate *why* the
// count drops, because two mechanisms do it together (the onChange handlers reset the
// field's validations to 'reset', and the dirty check in useCollectRecordValidation hides
// it immediately). getValidationSummary.test.ts covers the dirty check on its own.
test('Form status indicator counts match the validations on show, and drop as inputs are edited', async () => {
  const { user } = await renderFishBeltAndValidate(oneValidationPerRow)

  expect(getChipCount('error')).toBe(2)
  expect(getChipCount('warning')).toBe(2)
  expect(screen.queryByTestId('form-status-chip-ignore')).not.toBeInTheDocument()

  // Editing depth hides its inline error, so the error chip must drop to the observation only.
  await user.type(screen.getByTestId('depth-input'), '5')

  await waitFor(() => expect(getChipCount('error')).toBe(1))
  expect(getChipCount('warning')).toBe(2)

  // Editing the length surveyed input clears the last field warning too.
  await user.type(screen.getByTestId('len-surveyed-input'), '50')

  await waitFor(() => expect(getChipCount('warning')).toBe(1))
  expect(getChipCount('error')).toBe(1)
}, 50000)

// A surveyor reads the chip as "how much is left to deal with", so a row carrying three
// warnings has to count as three. Next is the other half of the contract: the three messages
// share a row, so they share one place to scroll to.
test('A row showing several warnings counts them all, and is still one place to scroll to', async () => {
  const scrollIntoView = vi
    .spyOn(window.HTMLElement.prototype, 'scrollIntoView')
    .mockImplementation(() => {})

  const { user } = await renderFishBeltAndValidate(threeWarningsOnOneRow)

  const row = document.querySelector('[data-observation-id="7"]')

  expect(row.querySelectorAll('li.warning-indicator')).toHaveLength(3)
  expect(getChipCount('warning')).toBe(3)

  // Two clicks, because a third would only be a second lap of the same single row.
  const nextButton = within(screen.getByTestId('form-status-chip-warning')).getByRole('button')

  await user.click(nextButton)
  await user.click(nextButton)

  expect(scrollIntoView.mock.instances).toEqual([row, row])
}, 50000)
