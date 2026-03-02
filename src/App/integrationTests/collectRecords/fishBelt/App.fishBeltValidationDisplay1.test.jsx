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
import mockFishbeltValidationsObject from '../../../../testUtilities/mockFishbeltValidationsObject'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import i18n from '../../../../../i18n'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Fishbelt validations will show the all warnings when there are multiple warnings and no errors', async () => {
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
              obs_belt_fishes: [
                [
                  {
                    code: `observation validation with ok status shouldn't show`,
                    status: 'ok',
                    validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
                    context: { observation_id: '7' },
                  },
                  {
                    code: 'observation warning 1',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                    context: { observation_id: '7' },
                  },
                  {
                    code: 'observation warning 2',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                    context: { observation_id: '7' },
                  },
                ],
              ],
              sample_event: {
                site: [
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
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))
  // regular inputs
  expect(within(screen.getByTestId('site')).getByText('firstWarning')).toBeInTheDocument()
  expect(within(screen.getByTestId('site')).getByText('secondWarning')).toBeInTheDocument()

  const observationsTable = screen.getByTestId('observations-section')

  expect(within(observationsTable).getByText('observation warning 1')).toBeInTheDocument()
  expect(within(observationsTable).getByText('observation warning 2')).toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 1')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 2')).not.toBeInTheDocument()
  expect(
    within(observationsTable).queryByText(`observation validation with ok status shouldn't show`),
  ).not.toBeInTheDocument()
}, 50000)

test('Validating an empty collect record, and then editing an input with errors shows the errors until the save button is pressed. Validations show when the validation button is clicked again.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: mockFishbeltValidationsObject,
      }

      const response = {
        benthic_attributes: {
          updates: mockMermaidData.benthic_attributes,
        },
        choices: {
          updates: mockMermaidData.choices,
        },
        collect_records: {
          updates: [collectRecordWithValidation],
        },
        fish_families: {
          updates: mockMermaidData.fish_families,
        },
        fish_genera: {
          updates: mockMermaidData.fish_genera,
        },
        fish_species: {
          updates: mockMermaidData.fish_species,
        },
        project_managements: {
          updates: mockMermaidData.project_managements,
        },
        project_profiles: {
          updates: mockMermaidData.project_profiles,
        },
        project_sites: {
          updates: mockMermaidData.project_sites,
        },
        projects: {
          updates: mockMermaidData.projects,
        },
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

  const tSpy = vi.spyOn(i18n, 't')

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  expect(tSpy).toHaveBeenCalledWith('validation_messages.required')

  expect(
    within(screen.getByTestId('depth')).getByText('validation_messages.required'),
  ).toBeInTheDocument()

  await user.type(screen.getByTestId('depth-input'), '1')

  // validations remain showing, except Depth is changed
  expect(
    await within(screen.getByTestId('site')).findByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('management')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('depth')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
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
    within(screen.getByTestId('width')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('size-bin')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('reef-slope')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('notes')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observers')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-section')).getByText('observation error'),
  ).toBeInTheDocument()

  await user.type(screen.getByTestId('depth-input'), '{backspace}')

  await user.click(await screen.findByTestId('save-button'))
  expect(await screen.findByTestId('saving-button'))
  expect(await screen.findByTestId('saved-button'))

  // validations hide
  expect(
    within(screen.getByTestId('site')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('management')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('depth')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-date')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample-time')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('transect-number')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('label')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('len-surveyed')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('width')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('size-bin')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('reef-slope')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('notes')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('observers')).queryByText('validation_messages.required'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-section')).queryByText('observation error'),
  ).not.toBeInTheDocument()

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  // validations show again
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
    within(screen.getByTestId('width')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('size-bin')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('reef-slope')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('notes')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observers')).getByText('validation_messages.required'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-section')).getByText('observation error'),
  ).toBeInTheDocument()
}, 60000)

test('Fishbelt validations will show passed input validations', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: {},
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

  // regular inputs

  expect(
    within(screen.getByTestId('site')).getByTestId('passed-validation-indicator'),
  ).toBeInTheDocument()

  // observations table (has three empty observation)
  expect(
    within(screen.getByTestId('observations-section')).getAllByTestId('passed-validation-indicator')
      .length,
  ).toEqual(3)
}, 50000)
