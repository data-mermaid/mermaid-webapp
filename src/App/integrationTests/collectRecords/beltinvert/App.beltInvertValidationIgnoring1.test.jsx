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
import mockBeltInvertCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBeltInvertCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Macroinvertebrate Validation: user can dismiss non-observations input warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBeltInvertCollectRecords[0],
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
              beltinvert_transect: {
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
                width: [
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
                size_bin: [
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
            },
          },
        },
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
        invert_attributes: { updates: mockMermaidData.invert_attributes },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-1'],
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
  const widthRow = screen.getByTestId('width')
  const sizeBinRow = screen.getByTestId('size-bin')
  const reefSlopeRow = screen.getByTestId('reef-slope')
  const relativeDepthRow = screen.getByTestId('relative-depth')
  const visibilityRow = screen.getByTestId('visibility')
  const currentRow = screen.getByTestId('current')
  const tideRow = screen.getByTestId('tide')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')

  const nonObservationRows = [
    siteRow,
    managementRow,
    depthRow,
    sampleDateRow,
    sampleTimeRow,
    transectNumberRow,
    labelRow,
    lengthSurveyedRow,
    widthRow,
    sizeBinRow,
    reefSlopeRow,
    relativeDepthRow,
    visibilityRow,
    currentRow,
    tideRow,
    notesRow,
    observersRow,
  ]

  for (const row of nonObservationRows) {
    expect(within(row).getByText('firstWarning')).toBeInTheDocument()
    expect(within(row).getByText('secondWarning')).toBeInTheDocument()
  }

  for (const [index, row] of nonObservationRows.entries()) {
    await user.click(within(row).getByTestId('ignore-warning-checkbox'))

    await waitFor(() =>
      expect(within(row).queryAllByTestId('message-pill-warning')).toHaveLength(0),
    )
    expect(within(row).getByText('firstWarning')).toBeInTheDocument()
    expect(within(row).getByText('secondWarning')).toBeInTheDocument()
    await waitFor(() => expect(within(row).getAllByTestId('message-pill-ignore')).toHaveLength(2))

    if (index === 0) {
      const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

      expect(isFormDirtyAfterIgnore)
    }
  }
}, 50000)

test('Macroinvertebrate Validation: user can dismiss record-level warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBeltInvertCollectRecords[0],
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
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
        invert_attributes: { updates: mockMermaidData.invert_attributes },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-1'],
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
    expect(
      within(recordLevelValidationsSection).queryByTestId('message-pill-warning'),
    ).not.toBeInTheDocument(),
  )
  expect(
    await within(recordLevelValidationsSection).findByTestId('message-pill-ignore'),
  ).toBeInTheDocument()

  await user.click(within(recordLevelValidationsSection).getByTestId('ignore-warning-checkbox'))
  expect(
    await within(recordLevelValidationsSection).findByTestId('message-pill-warning'),
  ).toBeInTheDocument()
  await waitFor(() =>
    expect(
      within(recordLevelValidationsSection).queryByTestId('message-pill-ignore'),
    ).not.toBeInTheDocument(),
  )

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
}, 50000)

test('Macroinvertebrate Validation: user can dismiss observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBeltInvertCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_belt_inverts: [
                [
                  {
                    context: { observation_id: '9' },
                    code: 'firstWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: '9' },
                    code: 'secondWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                  {
                    context: { observation_id: 'not9' },
                    code: 'someOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                ],
                [
                  {
                    context: { observation_id: 'not9' },
                    code: 'firstOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: 'not9' },
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
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
        invert_attributes: { updates: mockMermaidData.invert_attributes },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const observationsTable = screen.getByTestId('observations-section')

  expect(within(observationsTable).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observationsTable).getByText('secondWarning')).toBeInTheDocument()

  await user.click(within(observationsTable).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()

  expect(within(observationsTable).getByTestId('ignore-warning-checkbox')).toBeChecked()
  expect(within(observationsTable).getByTestId('ignore-warning-label'))

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
}, 60000)

test('Macroinvertebrate validation: user can reset dismissed non-observation input warnings', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBeltInvertCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              observers: [
                {
                  validation_id: Math.random(),
                  name: 'firstWarning',
                  status: 'ignore',
                  context: { observation_id: '7' },
                },
                {
                  validation_id: Math.random(),
                  name: 'secondWarning',
                  status: 'ignore',
                  context: { observation_id: '7' },
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
              beltinvert_transect: {
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
                width: [
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
                size_bin: [
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
              },
            },
          },
        },
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
        invert_attributes: { updates: mockMermaidData.invert_attributes },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-1'],
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
  const widthRow = screen.getByTestId('width')
  const sizeBinRow = screen.getByTestId('size-bin')
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
  expect(within(widthRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(sizeBinRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(visibilityRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(currentRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(tideRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(notesRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(observersRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(await within(siteRow).findByTestId('ignore-warning-checkbox'))

  const isFormDirtyAfterReset = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterReset)

  await waitFor(() => expect(within(siteRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(siteRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(siteRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(siteRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(managementRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(managementRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(managementRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(managementRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(managementRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(depthRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(depthRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(depthRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(depthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(depthRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(sampleDateRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(sampleDateRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(sampleDateRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(sampleTimeRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(sampleTimeRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(sampleTimeRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(transectNumberRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(transectNumberRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(transectNumberRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(
    within(transectNumberRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(labelRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(labelRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(labelRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(labelRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(labelRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(lengthSurveyedRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(lengthSurveyedRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(lengthSurveyedRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(
    within(lengthSurveyedRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(widthRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(widthRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(widthRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(widthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(widthRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(sizeBinRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(sizeBinRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(sizeBinRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(sizeBinRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sizeBinRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(reefSlopeRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(reefSlopeRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(reefSlopeRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(reefSlopeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(reefSlopeRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(relativeDepthRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() =>
    expect(within(relativeDepthRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(relativeDepthRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(relativeDepthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(
    within(relativeDepthRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(visibilityRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(visibilityRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(visibilityRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(visibilityRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(visibilityRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(currentRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(currentRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(currentRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(currentRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(currentRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(tideRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(tideRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(tideRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(tideRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(tideRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(notesRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(notesRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(notesRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(notesRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(notesRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(observersRow).getByTestId('ignore-warning-checkbox'))
  await waitFor(() => expect(within(observersRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(observersRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(observersRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observersRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()
}, 50000)
