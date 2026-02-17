import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import { http, HttpResponse } from 'msw'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockBenthicLitValidationsObject from '../../../../testUtilities/mockCollectRecords/mockBenthicLitValidationsObject'
import App from '../../../App'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBenthicLitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Submit Benthic LIT success shows toast message and redirects to collect record list page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    http.post(
      `${apiBaseUrl}/pull/`,
      () => {
        const collectRecordWithValidationFailing = {
          ...mockBenthicLitCollectRecords[0],
          validations: mockBenthicLitValidationsObject, // fails validation
        }

        const firstPullResponse = {
          benthic_attributes: { updates: mockMermaidData.benthic_attributes },
          choices: { updates: mockMermaidData.choices },
          collect_records: { updates: [collectRecordWithValidationFailing] },
          fish_families: { updates: mockMermaidData.fish_families },
          fish_genera: { updates: mockMermaidData.fish_genera },
          fish_species: { updates: mockMermaidData.fish_species },
          project_managements: { updates: mockMermaidData.project_managements },
          project_profiles: { updates: mockMermaidData.project_profiles },
          project_sites: { updates: mockMermaidData.project_sites },
          projects: { updates: mockMermaidData.projects },
        }

        return HttpResponse.json(firstPullResponse)
      },
      { once: true },
    ),
    http.post(
      `${apiBaseUrl}/pull/`,
      () => {
        const collectRecordWithValidationOk = {
          ...mockBenthicLitCollectRecords[0],
          validations: { status: 'ok' },
        }

        const secondPullResponse = {
          benthic_attributes: { updates: mockMermaidData.benthic_attributes },
          choices: { updates: mockMermaidData.choices },
          collect_records: { updates: [collectRecordWithValidationOk] },
          fish_families: { updates: mockMermaidData.fish_families },
          fish_genera: { updates: mockMermaidData.fish_genera },
          fish_species: { updates: mockMermaidData.fish_species },
          project_managements: { updates: mockMermaidData.project_managements },
          project_profiles: { updates: mockMermaidData.project_profiles },
          project_sites: { updates: mockMermaidData.project_sites },
          projects: { updates: mockMermaidData.projects },
        }

        return HttpResponse.json(secondPullResponse)
      },
      { once: true },
    ),
  )

  await user.click(await screen.findByTestId('validate-button'))
  expect(await screen.findByTestId('validated-button'))

  await user.click(await screen.findByTestId('submit-button'))

  expect(await screen.findByTestId('collecting-title'))

  // we dont test that the record is removed from dexie becuase that is the responsibility
  // of sync + the api.Post submit pulls updates and deletes.
})

test('Submit Benthic LIT failure shows toast message and an enabled submit button', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    http.post(
      `${apiBaseUrl}/pull/`,
      () => {
        const collectRecordWithValidationFailing = {
          ...mockBenthicLitCollectRecords[0],
          validations: mockBenthicLitValidationsObject, // fails validation
        }

        const firstPullResponse = {
          benthic_attributes: { updates: mockMermaidData.benthic_attributes },
          choices: { updates: mockMermaidData.choices },
          collect_records: { updates: [collectRecordWithValidationFailing] },
          fish_families: { updates: mockMermaidData.fish_families },
          fish_genera: { updates: mockMermaidData.fish_genera },
          fish_species: { updates: mockMermaidData.fish_species },
          project_managements: { updates: mockMermaidData.project_managements },
          project_profiles: { updates: mockMermaidData.project_profiles },
          project_sites: { updates: mockMermaidData.project_sites },
          projects: { updates: mockMermaidData.projects },
        }

        return HttpResponse.json(firstPullResponse)
      },
      { once: true },
    ),
    http.post(
      `${apiBaseUrl}/pull/`,
      () => {
        const collectRecordWithValidationOk = {
          ...mockBenthicLitCollectRecords[0],
          validations: { status: 'ok' },
        }

        const secondPullResponse = {
          benthic_attributes: { updates: mockMermaidData.benthic_attributes },
          choices: { updates: mockMermaidData.choices },
          collect_records: { updates: [collectRecordWithValidationOk] },
          fish_families: { updates: mockMermaidData.fish_families },
          fish_genera: { updates: mockMermaidData.fish_genera },
          fish_species: { updates: mockMermaidData.fish_species },
          project_managements: { updates: mockMermaidData.project_managements },
          project_profiles: { updates: mockMermaidData.project_profiles },
          project_sites: { updates: mockMermaidData.project_sites },
          projects: { updates: mockMermaidData.projects },
        }

        return HttpResponse.json(secondPullResponse)
      },
      { once: true },
    ),
    http.post(`${apiBaseUrl}/projects/5/collectrecords/submit/`, () => {
      return HttpResponse.json({}, { status: 400 })
    }),
  )

  await user.click(await screen.findByTestId('validate-button'))
  expect(await screen.findByTestId('validated-button')) // just to make act errors silence
  await user.click(await screen.findByTestId('submit-button'))

  expect(await screen.findByTestId('submit-button')).toBeEnabled()
  expect(await screen.findByTestId('validated-button')).toBeDisabled()
  expect(await screen.findByTestId('saved-button')).toBeDisabled()
})
