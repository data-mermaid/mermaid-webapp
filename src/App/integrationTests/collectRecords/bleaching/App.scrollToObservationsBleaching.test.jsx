import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBleachingCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// Bleaching is the only protocol with two observation tables, so it is the only one where
// "Scroll to observations" has to pick. Colonies bleached is rendered first, percent cover
// second, and each warning names its own table in `fields`.
const validationFor = (observationsPropertyName) => ({
  status: 'warning',
  results: {
    $record: [
      {
        code: 'all_equal',
        status: 'warning',
        validation_id: `${observationsPropertyName}-warning`,
        fields: [`data.${observationsPropertyName}`],
      },
    ],
  },
})

const renderValidatedBleachingRecord = async (observationsPropertyName) => {
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
          updates: [
            {
              ...mockBleachingCollectRecords[0],
              validations: validationFor(observationsPropertyName),
            },
          ],
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

  scrollIntoView.mockClear()
  // The react-i18next mock renders keys rather than English.
  await user.click(await screen.findByText('sample_units.scroll_to_observations'))

  return { scrollIntoView }
}

test('Scroll to observations goes to the colonies bleached table when the warning names it', async () => {
  const { scrollIntoView } = await renderValidatedBleachingRecord('obs_colonies_bleached')

  expect(scrollIntoView).toHaveBeenCalledTimes(1)
  expect(scrollIntoView.mock.instances[0]).toHaveAttribute(
    'data-observation-table',
    'obs_colonies_bleached',
  )
}, 50000)

test('Scroll to observations goes to the percent cover table when the warning names it', async () => {
  const { scrollIntoView } = await renderValidatedBleachingRecord('obs_quadrat_benthic_percent')

  expect(scrollIntoView).toHaveBeenCalledTimes(1)
  expect(scrollIntoView.mock.instances[0]).toHaveAttribute(
    'data-observation-table',
    'obs_quadrat_benthic_percent',
  )
}, 50000)
