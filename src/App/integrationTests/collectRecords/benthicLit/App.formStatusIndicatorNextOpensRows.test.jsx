import { expect, test, vi } from 'vitest'
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
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBenthicLitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// The test setup's t() returns the key, so the toggle is found by key.
const SHOW = 'validations.show'
const HIDE = 'validations.hide'

// Two warnings on each of rows 1 to 3, so every row collapses.
const twoWarnings = (observationId) =>
  ['a', 'b'].map((suffix) => ({
    code: 'value_not_set',
    status: 'warning',
    validation_id: `${observationId}-${suffix}`,
    context: { observation_id: observationId },
  }))

const validations = {
  status: 'warning',
  results: { data: { obs_benthic_lits: ['1', '2', '3'].map(twoWarnings) } },
}

const getRow = (observationId) =>
  within(document.querySelector(`[data-observation-id="${observationId}"]`))

test('Next opens the row it lands on and closes it when it moves, including a row opened by hand', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {})

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/pull/`, () =>
      HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: {
          updates: [{ ...mockBenthicLitCollectRecords[0], validations }],
        },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }),
    ),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/projects/5/collecting/benthiclit/70'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  // The stored validations show on open, without a Validate click.
  const nextButton = within(
    await screen.findByTestId('form-status-chip-warning', {}, { timeout: 10000 }),
  ).getByRole('button')

  await user.click(getRow('3').getByRole('button', { name: SHOW }))

  // jsdom has no layout, so Next keeps the rows in table order. Only one row is open at a time,
  // so the row opened by hand closes when Next opens the first.
  await user.click(nextButton)

  expect(getRow('1').getByRole('button', { name: HIDE })).toBeInTheDocument()
  expect(getRow('3').getByRole('button', { name: SHOW })).toBeInTheDocument()

  await user.click(nextButton)

  expect(getRow('1').getByRole('button', { name: SHOW })).toBeInTheDocument()
  expect(getRow('2').getByRole('button', { name: HIDE })).toBeInTheDocument()
  expect(getRow('3').getByRole('button', { name: SHOW })).toBeInTheDocument()
}, 50000)
