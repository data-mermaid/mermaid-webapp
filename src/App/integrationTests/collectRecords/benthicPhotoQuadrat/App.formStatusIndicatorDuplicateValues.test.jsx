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
import mockBenthicPhotoQuadratCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicPhotoQuadratCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// A duplicate_values record validation names the rows it covers in context.duplicates, and
// getObservationValidationInfo marks every one of them. Observations 1 and 2 are named here,
// 3 is not, so the chip should reach the record message and those two rows only.
const validations = {
  status: 'error',
  results: {
    $record: [
      {
        code: 'duplicate_values',
        status: 'warning',
        validation_id: 'duplicate-values-warning',
        fields: ['data.obs_benthic_photo_quadrats'],
        context: {
          duplicates: [
            [
              { id: '1', index: 0 },
              { id: '2', index: 1 },
            ],
          ],
        },
      },
    ],
  },
}

test('Next on the warning chip reaches every row a duplicate_values warning marks', async () => {
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
          updates: [{ ...mockBenthicPhotoQuadratCollectRecords[0], validations }],
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
    { initialEntries: ['/projects/5/collecting/benthicpqt/90'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const warningChip = await screen.findByTestId('form-status-chip-warning')
  const nextButton = within(warningChip).getByRole('button')

  const recordMessage = document.querySelector('[data-record-validation-id]')
  const markedRows = ['1', '2'].map((id) => document.querySelector(`[data-observation-id="${id}"]`))

  // The record message plus the two rows it names, in page order, then back to the top.
  const expectedOrder = [recordMessage, ...markedRows, recordMessage]

  for (const expectedTarget of expectedOrder) {
    scrollIntoView.mockClear()
    await user.click(nextButton)

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView.mock.instances[0]).toBe(expectedTarget)
  }

  // Observation 3 is not in context.duplicates, so it is never a target.
  const unmarkedRow = document.querySelector('[data-observation-id="3"]')

  expect(unmarkedRow).not.toBeNull()
  expect(scrollIntoView.mock.instances).not.toContain(unmarkedRow)
}, 50000)
