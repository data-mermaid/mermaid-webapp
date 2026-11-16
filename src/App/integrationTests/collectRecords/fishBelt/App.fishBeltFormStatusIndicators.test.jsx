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

const renderFishBelt = (validations) => {
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

  return { user }
}

const renderFishBeltAndValidate = async (validations) => {
  const { user } = renderFishBelt(validations)

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
// editing an input greys its validation and takes it out of the count. The onChange handlers
// mark the field's validations stale, and getValidationSummary.test.ts covers the counting.
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

// Validate keeps a check ignored after it passes: the API returns `ignore` with a null code. One
// such result at each level, beside a warning that is still ignored.
const ignoredChecksThatHavePassed = {
  status: 'ok',
  results: {
    $record: [
      { name: 'observation_count_validator', code: null, status: 'ignore', validation_id: 'r1' },
      { code: 'all_equal', status: 'ignore', validation_id: 'still-ignored' },
    ],
    data: {
      fishbelt_transect: {
        depth: [{ name: 'depth_validator', code: null, status: 'ignore', validation_id: 'd1' }],
      },
      obs_belt_fishes: [
        [
          {
            name: 'fish_size_validator',
            code: null,
            status: 'ignore',
            validation_id: 'o1',
            context: { observation_id: '7' },
          },
        ],
      ],
    },
  },
}

test('An ignored check that has since passed shows nothing and is not counted as ignored', async () => {
  // Only an ignore is left, so the API calls the record ok and it opens already validated.
  renderFishBelt(ignoredChecksThatHavePassed)

  expect(
    await screen.findByTestId('form-status-indicators', {}, { timeout: 10000 }),
  ).toBeInTheDocument()
  await waitFor(() => expect(getChipCount('ignored')).toBe(1))
  expect(screen.getAllByTestId('ignore-warning-checkbox')).toHaveLength(1)

  for (const name of ['observation_count_validator', 'depth_validator', 'fish_size_validator']) {
    expect(screen.queryByText(name)).not.toBeInTheDocument()
  }
}, 50000)

const mockCurrentUserCreatedOn = (created_on) =>
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/me`, () => HttpResponse.json({ id: 'fake-id', created_on })),
  )

const announcementTitle = 'sample_units.validation_announcement.title'

test('A Validate that finds errors announces the counts bar to an existing account, once', async () => {
  mockCurrentUserCreatedOn('2020-01-01T00:00:00Z')

  const { user } = await renderFishBeltAndValidate(oneValidationPerRow)

  expect(await screen.findByText(announcementTitle)).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'sample_units.validation_announcement.read_the_guide' }),
  ).toHaveAttribute(
    'href',
    'https://datamermaid.org/documentation/collect-data-validation-submission',
  )

  await user.click(screen.getByText('sample_units.validation_announcement.done'))

  expect(screen.queryByText(announcementTitle)).not.toBeInTheDocument()
  // validationAnnouncement.test.ts covers this flag keeping it from opening again.
  expect(localStorage.getItem('validation-release-announcement-seen:fake-id')).toBe('true')
}, 50000)

test('Validate announces nothing to an account created after the release', async () => {
  mockCurrentUserCreatedOn('2027-01-01T00:00:00Z')

  await renderFishBeltAndValidate(oneValidationPerRow)

  expect(screen.queryByText(announcementTitle)).not.toBeInTheDocument()
}, 50000)
