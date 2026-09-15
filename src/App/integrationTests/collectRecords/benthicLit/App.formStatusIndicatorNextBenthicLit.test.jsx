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
import mockBenthicLitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const validations = {
  status: 'error',
  results: {
    data: {
      benthic_transect: {
        depth: [{ code: 'required', status: 'error', validation_id: 'depth-error' }],
      },
    },
  },
}

// Benthic LIT is one of the protocols whose transect inputs never opted into validation
// navigation. Its rows are reachable because the shared input components tag every row with
// their own id, so this would fail for any protocol that had to opt in by hand.
test('Next on the error chip scrolls to and highlights a Benthic LIT transect field', async () => {
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

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const depthRow = (await screen.findByTestId('depth')).closest('[data-validation-field]')

  expect(depthRow).toHaveAttribute('data-validation-field', 'depth')

  scrollIntoView.mockClear()
  await user.click(within(await screen.findByTestId('form-status-chip-error')).getByRole('button'))

  expect(scrollIntoView).toHaveBeenCalledTimes(1)
  expect(scrollIntoView.mock.instances[0]).toBe(depthRow)
  expect(depthRow).toHaveClass('validation-target-highlight')
}, 50000)
