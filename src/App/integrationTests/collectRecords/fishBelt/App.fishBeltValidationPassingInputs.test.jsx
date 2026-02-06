import { expect, test } from "vitest";
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

  expect(within(screen.getByTestId('site')).getByLabelText('Passed Validation')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('management')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('depth')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-date')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-time')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('transect-number')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('label')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('len-surveyed')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('width')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('size-bin')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('reef-slope')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('relative-depth')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('visibility')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('current')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(within(screen.getByTestId('tide')).getByLabelText('Passed Validation')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('notes')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observers')).getByLabelText('Passed Validation'),
  ).toBeInTheDocument()
})
