import { expect, test, vi } from 'vitest'
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
import mockBenthicPitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicPitCollectRecords'
import mockBenthicPitValidationsObject from '../../../../testUtilities/mockBenthicPitValidationsObject'
import i18n from '../../../../../i18n'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Validating an empty benthic PIT collect record shows validations (proof of wire-up)', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBenthicPitCollectRecords[0],
        validations: mockBenthicPitValidationsObject,
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
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  const tSpy = vi.spyOn(i18n, 't')
  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  expect(tSpy).toHaveBeenCalledWith('validation_messages.required')
  // record level validations
  expect(screen.getByText('record level error 1')).toBeInTheDocument()
  expect(screen.getByText('record level error 2')).toBeInTheDocument()
  expect(screen.getByText('record level warning 1')).toBeInTheDocument()
  expect(screen.getByText('record level warning 2')).toBeInTheDocument()
  expect(screen.queryByText(`OK validation shouldn't show`)).not.toBeInTheDocument()

  // input level validations

  expect(
    within(screen.getByTestId('site')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('management')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('depth')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-date')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-time')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('transect-number')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('label')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('len-surveyed')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('reef-slope')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('interval-size')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('interval-start')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('relative-depth')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('current')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('tide')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('notes')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observers')).getByText('validation_messages.required'),
  ).toBeInTheDocument()

  // observations table (has one empty observation)

  const observationsTable = screen.getByTestId('observations-section')

  expect(within(observationsTable).getByText('observation error')).toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation warning')).not.toBeInTheDocument()
  expect(
    within(observationsTable).queryByText(`observation validation with ok status shouldn't show`),
  ).not.toBeInTheDocument()
})

test('Benthic PIT validations will show only the first error when there are multiple errors and warnings', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBenthicPitCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_benthic_pits: [
                [
                  {
                    code: `observation validation with ok status shouldn't show`,
                    status: 'ok',
                    validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
                    context: { observation_id: '1' },
                  },
                  {
                    code: 'observation error 1',
                    status: 'error',
                    validation_id: '2b289dc99c02e9ae1c764e8a71cca3cc',
                    context: { observation_id: '1' },
                  },
                  {
                    code: 'observation warning 1',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                    context: { observation_id: '1' },
                  },
                  {
                    code: 'observation error 2',
                    status: 'error',
                    validation_id: '2b289dc99c02e9ae1c764e8a71cca3c8',
                    context: { observation_id: '1' },
                  },
                  {
                    code: 'observation warning 2',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                    context: { observation_id: '1' },
                  },
                ],
              ],
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    code: 'firstError',
                    status: 'error',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondError',
                    status: 'error',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'warning',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'warning',
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
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  // regular inputs

  expect(within(screen.getByTestId('site')).getByText('firstError')).toBeInTheDocument()
  expect(within(screen.getByTestId('site')).queryByText('secondError')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('site')).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('site')).queryByText('secondWarning')).not.toBeInTheDocument()

  // observations table (has one empty observation)

  const observationsTable = screen.getByTestId('observations-section')

  expect(within(observationsTable).getByText('observation error 1')).toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 2')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation warning 1')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation warning 2')).not.toBeInTheDocument()
  expect(
    within(observationsTable).queryByText(`observation validation with ok status shouldn't show`),
  ).not.toBeInTheDocument()
})
