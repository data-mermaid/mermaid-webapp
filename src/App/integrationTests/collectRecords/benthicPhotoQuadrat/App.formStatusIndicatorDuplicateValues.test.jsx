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
import { mockT } from '../../../../testUtilities/mockT'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// A duplicate_values record validation names the rows it covers in context.duplicates, and
// getObservationValidationInfo marks every one of them. Observations 1 and 2 are named here,
// 3 is not. The API always sends duplicate_values as an error.
const validations = {
  status: 'error',
  results: {
    $record: [
      {
        code: 'duplicate_values',
        status: 'error',
        validation_id: 'duplicate-values-error',
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

test('A duplicate_values error counts once per row it marks, and Next stops on those rows only', async () => {
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

  const errorChip = await screen.findByTestId('form-status-chip-error')
  const nextButton = within(errorChip).getByRole('button')

  const errorChipCalls = mockT.mock.calls.filter(
    ([key]) => key === 'sample_units.validation_status.chip_label_error',
  )

  expect(errorChipCalls.at(-1)?.[1]?.count).toBe(2)

  // The message under the heading still shows, as a summary of the marked rows.
  const recordMessage = document.querySelector('[data-record-validation-id]')
  const markedRows = ['1', '2'].map((id) => document.querySelector(`[data-observation-id="${id}"]`))

  expect(recordMessage).not.toBeNull()
  expect(document.querySelector('[data-observation-id="3"]')).not.toBeNull()

  // The two rows it names, in page order, then back to the first: those are the only stops, so
  // neither the message nor observation 3 is one.
  const expectedOrder = [...markedRows, markedRows[0]]

  for (const expectedTarget of expectedOrder) {
    scrollIntoView.mockClear()
    await user.click(nextButton)

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView.mock.instances[0]).toBe(expectedTarget)
  }
}, 50000)
