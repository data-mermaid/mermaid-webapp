import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  within,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Fishbelt validations show check for valid inputs', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: {
          status: 'error',
          results: {
            data: {
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    code: 'firstError',
                    status: 'ok', // site has an explicit pass for validation, the rest have no info, so we interpret that as a pass
                  },
                ],
              },
            },
          },
        },
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  expect(
    within(screen.getByTestId('site')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('management')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('depth')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-date')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-time')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('transect-number')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('label')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('len-surveyed')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('width')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('size-bin')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('reef-slope')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('relative-depth')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('visibility')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('current')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('tide')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('notes')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observers')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()
})
