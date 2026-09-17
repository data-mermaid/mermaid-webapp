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
import mockBleachingCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// Bleaching is the only protocol with two observation tables, so it is the one that can put
// the same observation id in two places on the page. Every colonies bleached row is a
// duplicate here, matching what a surveyor sees after entering the same attribute three times.
const validations = {
  status: 'error',
  results: {
    $record: [
      {
        code: 'duplicate_values',
        status: 'warning',
        validation_id: 'duplicate-values-warning',
        fields: ['data.obs_colonies_bleached'],
        context: {
          duplicates: [
            [
              { id: '1', index: 0 },
              { id: '2', index: 1 },
              { id: '3', index: 2 },
            ],
          ],
        },
      },
    ],
  },
}

test('Next on the warning chip reaches every duplicated colonies bleached row', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
  const scrollIntoView = vi
    .spyOn(window.HTMLElement.prototype, 'scrollIntoView')
    .mockImplementation(() => {})

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () =>
      HttpResponse.json({}, { status: 200 }),
    ),

    http.post(`${apiBaseUrl}/pull/`, () =>
      HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: {
          updates: [{ ...mockBleachingCollectRecords[0], validations }],
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
    { initialEntries: ['/projects/5/collecting/bleachingqc/60'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const warningChip = await screen.findByTestId('form-status-chip-warning')
  const nextButton = within(warningChip).getByRole('button')

  const recordMessage = document.querySelector('[data-record-validation-id]')
  const markedRows = ['1', '2', '3'].map((id) =>
    document.querySelector(`[data-observation-id="${id}"]`),
  )

  expect(markedRows.every(Boolean)).toBe(true)

  // The record message, then each duplicated row in page order, then back to the top.
  const expectedOrder = [recordMessage, ...markedRows, recordMessage]

  for (const expectedTarget of expectedOrder) {
    scrollIntoView.mockClear()
    await user.click(nextButton)

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView.mock.instances[0]).toBe(expectedTarget)
  }
}, 50000)
