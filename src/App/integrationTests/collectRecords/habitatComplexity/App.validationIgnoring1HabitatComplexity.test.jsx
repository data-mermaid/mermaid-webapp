import { expect, test } from 'vitest'
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
import mockHabitatComplexityCollectRecords from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Habitat Complexity validation: user can dismiss non-observations input warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              observers: [
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
                management: [
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
                sample_date: [
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
              interval_size: [
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
              benthic_transect: {
                depth: [
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
                sample_time: [
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
                number: [
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
                label: [
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
                len_surveyed: [
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
                reef_slope: [
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
                relative_depth: [
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
                visibility: [
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
                current: [
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
                tide: [
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
                notes: [
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
              obs_habitat_complexities: [],
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
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const siteRow = screen.getByTestId('site')
  const managementRow = screen.getByTestId('management')
  const depthRow = screen.getByTestId('depth')
  const sampleDateRow = screen.getByTestId('sample-date')
  const sampleTimeRow = screen.getByTestId('sample-time')
  const transectNumberRow = screen.getByTestId('transect-number')
  const labelRow = screen.getByTestId('label')
  const lengthSurveyedRow = screen.getByTestId('len-surveyed')
  const intervalSizeRow = screen.getByTestId('interval-size')
  const reefSlopeRow = screen.getByTestId('reef-slope')
  const relativeDepthRow = screen.getByTestId('relative-depth')
  const visibilityRow = screen.getByTestId('visibility')
  const currentRow = screen.getByTestId('current')
  const tideRow = screen.getByTestId('tide')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')

  expect(within(siteRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(siteRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(managementRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(managementRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(depthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(depthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(sampleDateRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(sampleDateRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(sampleTimeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(sampleTimeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(transectNumberRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(transectNumberRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(labelRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(labelRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(intervalSizeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(intervalSizeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(visibilityRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(visibilityRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(currentRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(currentRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(tideRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(tideRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(notesRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(notesRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(observersRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observersRow).getByText('secondWarning')).toBeInTheDocument()

  const siteIgnoreWarningCheckbox = within(siteRow).getAllByTestId('ignore-warning-checkbox')[0]

  await user.click(siteIgnoreWarningCheckbox)

  await waitFor(() =>
    expect(within(siteRow).getAllByTestId('message-pill-warning')).toHaveLength(1),
  )
  expect(within(siteRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(siteRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(siteRow).getAllByTestId('ignore-warning-checkbox')[0])
  expect(within(siteRow).getAllByTestId('message-pill-ignore')).toHaveLength(1)

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
  await user.click(within(managementRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(managementRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(managementRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(managementRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(managementRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(depthRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(depthRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(depthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(depthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(depthRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(sampleDateRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(sampleDateRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(sampleDateRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(sampleDateRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(sampleDateRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(sampleTimeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(sampleTimeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(sampleTimeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(sampleTimeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(sampleTimeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(transectNumberRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(transectNumberRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(transectNumberRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(transectNumberRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(transectNumberRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(labelRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(labelRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(labelRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(labelRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(labelRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(lengthSurveyedRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(lengthSurveyedRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(lengthSurveyedRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(intervalSizeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(intervalSizeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(intervalSizeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(intervalSizeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(intervalSizeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(reefSlopeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(reefSlopeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(relativeDepthRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(relativeDepthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(visibilityRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(visibilityRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(visibilityRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(visibilityRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(visibilityRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(currentRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(currentRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(currentRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(currentRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(currentRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(tideRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() => expect(within(tideRow).getAllByTestId('message-pill-ignore')).toHaveLength(1))
  expect(within(tideRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(tideRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(tideRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(notesRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(notesRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(notesRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(notesRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(notesRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(observersRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(observersRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(observersRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observersRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(observersRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
}, 50000)

test('Habitat Complexity validation: user can dismiss record-level warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            $record: [
              {
                name: 'record level warning',
                status: 'warning',
                validation_id: '63043489232e671a4f9231fdf6d2665f',
              },
            ],
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
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const recordLevelValidationsSection = screen.getByTestId('record-level-validations')

  expect(
    within(recordLevelValidationsSection).getByTestId('message-pill-warning'),
  ).toBeInTheDocument()

  await user.click(within(recordLevelValidationsSection).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(recordLevelValidationsSection).queryByText('warning')).not.toBeInTheDocument(),
  )
  expect(
    await within(recordLevelValidationsSection).findByTestId('message-pill-ignore'),
  ).toBeInTheDocument()

  await user.click(within(recordLevelValidationsSection).getByTestId('ignore-warning-checkbox'))
  expect(
    await within(recordLevelValidationsSection).findByTestId('message-pill-warning'),
  ).toBeInTheDocument()
  await waitFor(() =>
    expect(within(recordLevelValidationsSection).queryByText('ignored')).not.toBeInTheDocument(),
  )

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
}, 50000)

test('Habitat Complexity validation: user can dismiss observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_habitat_complexities: [
                [
                  {
                    context: { observation_id: '1' },
                    code: 'firstWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: '1' },
                    code: 'secondWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                  {
                    context: { observation_id: 'not1' },
                    code: 'someOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                ],
                [
                  {
                    context: { observation_id: 'not1' },
                    code: 'firstOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: 'not1' },
                    code: 'secondOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                ],
              ],
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
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const observationsSection = screen.getByTestId('observations-section')
  const observationsTable = within(observationsSection).getByRole('table')

  expect(within(observationsTable).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observationsTable).getByText('secondWarning')).toBeInTheDocument()

  // Each warning has its own box, and ticking one ignores that warning alone. Both stay on
  // screen, the ignored one with its own pill.
  await user.click(within(observationsTable).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(observationsTable).getAllByTestId('ignore-warning-checkbox')[0]).toBeChecked(),
  )
  expect(within(observationsTable).getAllByTestId('ignore-warning-checkbox')[1]).not.toBeChecked()
  expect(within(observationsTable).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observationsTable).getByText('secondWarning')).toBeInTheDocument()
  expect(within(observationsTable).getAllByTestId('message-pill-ignore')).toHaveLength(1)

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
}, 60000)

test('Habitat Complexity validation: user can reset dismissed non-observation input warnings', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              interval_size: [
                {
                  validation_id: Math.random(),
                  name: 'firstWarning',
                  status: 'ignore',
                },
                {
                  validation_id: Math.random(),
                  name: 'secondWarning',
                  status: 'ignore',
                },
              ],
              observers: [
                {
                  validation_id: Math.random(),
                  name: 'firstWarning',
                  status: 'ignore',
                  context: { observation_id: '1' },
                },
                {
                  validation_id: Math.random(),
                  name: 'secondWarning',
                  status: 'ignore',
                  context: { observation_id: '1' },
                },
              ],
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                management: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                sample_date: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
              },
              benthic_transect: {
                depth: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                sample_time: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                number: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                label: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                len_surveyed: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                reef_slope: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                relative_depth: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                visibility: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                current: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                tide: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                notes: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
                    status: 'ignore',
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
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const siteRow = screen.getByTestId('site')
  const managementRow = screen.getByTestId('management')
  const depthRow = screen.getByTestId('depth')
  const sampleDateRow = screen.getByTestId('sample-date')
  const sampleTimeRow = screen.getByTestId('sample-time')
  const transectNumberRow = screen.getByTestId('transect-number')
  const labelRow = screen.getByTestId('label')
  const lengthSurveyedRow = screen.getByTestId('len-surveyed')
  const intervalSizeRow = screen.getByTestId('interval-size')
  const reefSlopeRow = screen.getByTestId('reef-slope')
  const relativeDepthRow = screen.getByTestId('relative-depth')
  const visibilityRow = screen.getByTestId('visibility')
  const currentRow = screen.getByTestId('current')
  const tideRow = screen.getByTestId('tide')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')

  expect(within(siteRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(managementRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(depthRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(sampleDateRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(sampleTimeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(transectNumberRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(labelRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(lengthSurveyedRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(intervalSizeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(visibilityRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(currentRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(tideRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(notesRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(observersRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click((await within(siteRow).findAllByTestId('ignore-warning-checkbox'))[0])

  const isFormDirtyAfterReset = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterReset)

  await waitFor(() => expect(within(siteRow).getAllByTestId('message-pill-ignore')).toHaveLength(1))
  expect(within(siteRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(siteRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(siteRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(managementRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(managementRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )

  expect(within(managementRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(managementRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(managementRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(depthRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(depthRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(depthRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(depthRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(depthRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(sampleDateRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(sampleDateRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(sampleDateRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(sampleDateRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(sampleDateRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(sampleTimeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(sampleTimeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(sampleTimeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(sampleTimeRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(sampleTimeRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(transectNumberRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(transectNumberRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(transectNumberRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(transectNumberRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(
    within(transectNumberRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(labelRow).getAllByTestId('ignore-warning-checkbox')[0])
  await waitFor(() =>
    expect(within(labelRow).getAllByTestId('message-pill-warning')).toHaveLength(1),
  )
  expect(within(labelRow).getAllByTestId('message-pill-ignore')).toHaveLength(1)
  expect(within(labelRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(labelRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(lengthSurveyedRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(lengthSurveyedRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(lengthSurveyedRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(lengthSurveyedRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(
    within(lengthSurveyedRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(intervalSizeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(intervalSizeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(intervalSizeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(intervalSizeRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(
    within(intervalSizeRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(reefSlopeRow).getAllByTestId('ignore-warning-checkbox')[0])
  await waitFor(() =>
    expect(within(reefSlopeRow).getAllByTestId('message-pill-warning')).toHaveLength(1),
  )
  expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1)
  expect(within(reefSlopeRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(reefSlopeRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(relativeDepthRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(relativeDepthRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(relativeDepthRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(
    within(relativeDepthRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(visibilityRow).getAllByTestId('ignore-warning-checkbox')[0])
  await waitFor(() =>
    expect(within(visibilityRow).getAllByTestId('message-pill-warning')).toHaveLength(1),
  )
  expect(within(visibilityRow).getAllByTestId('message-pill-ignore')).toHaveLength(1)
  expect(within(visibilityRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(visibilityRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(currentRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(currentRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(currentRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(currentRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(currentRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(tideRow).getAllByTestId('ignore-warning-checkbox')[0])
  await waitFor(() =>
    expect(within(tideRow).getAllByTestId('message-pill-warning')).toHaveLength(1),
  )
  expect(within(tideRow).getAllByTestId('message-pill-ignore')).toHaveLength(1)
  expect(within(tideRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(tideRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(notesRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(notesRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(notesRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(notesRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(notesRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(observersRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(observersRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(observersRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(observersRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(observersRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()
}, 50000)
