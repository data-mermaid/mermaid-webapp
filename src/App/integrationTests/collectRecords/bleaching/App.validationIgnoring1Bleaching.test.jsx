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
import mockBleachingCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Bleaching collect record validation: user can dismiss non-observations input warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
              quadrat_collection: {
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
                quadrat_size: [
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
              obs_colonies_bleached: [],
              obs_quadrat_benthic_percent: [],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
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
  const quadratSizeRow = screen.getByTestId('quadrat-size')
  const labelRow = screen.getByTestId('label')
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
  expect(within(quadratSizeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(quadratSizeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(labelRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(labelRow).getByText('secondWarning')).toBeInTheDocument()
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

  await user.click(within(siteRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(siteRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(siteRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(siteRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(siteRow).getByTestId('ignore-warning-checkbox')).toBeInTheDocument()
  expect(within(siteRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
  await user.click(within(managementRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(managementRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(managementRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(managementRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(managementRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(depthRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(depthRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(depthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(depthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(depthRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(sampleDateRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(sampleDateRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(sampleDateRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(sampleDateRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(sampleDateRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(sampleTimeRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(sampleTimeRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(sampleTimeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(sampleTimeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(sampleTimeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(quadratSizeRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(quadratSizeRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(quadratSizeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(quadratSizeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(labelRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(labelRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(labelRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(labelRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(labelRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(relativeDepthRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(relativeDepthRow).queryByText('warning')).not.toBeInTheDocument(),
  )
  expect(within(relativeDepthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(visibilityRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(visibilityRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(visibilityRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(visibilityRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(visibilityRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(currentRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(currentRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(currentRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(currentRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(currentRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(tideRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(tideRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(tideRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(tideRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(tideRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(notesRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(notesRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(notesRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(notesRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(notesRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(within(observersRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() => expect(within(observersRow).queryByText('warning')).not.toBeInTheDocument())
  expect(within(observersRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observersRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(observersRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
}, 50000)

test('Bleaching collect record validation: user can dismiss record-level warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
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
    within(recordLevelValidationsSection).getByTestId('message-pill-ignore'),
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

test('Bleaching collect record validation: user can dismiss colonies bleached observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_colonies_bleached: [
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const coloniesBleachedObservationsTable = screen.getByTestId('observations-section-table')

  expect(within(coloniesBleachedObservationsTable).getByText('firstWarning')).toBeInTheDocument()
  expect(within(coloniesBleachedObservationsTable).getByText('secondWarning')).toBeInTheDocument()

  await user.click(within(coloniesBleachedObservationsTable).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(
      within(coloniesBleachedObservationsTable).queryByText('firstWarning'),
    ).not.toBeInTheDocument(),
  )
  expect(
    within(coloniesBleachedObservationsTable).queryByText('secondWarning'),
  ).not.toBeInTheDocument()

  expect(
    within(coloniesBleachedObservationsTable).getByTestId('ignore-warning-checkbox'),
  ).toBeChecked()

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
}, 60000)

test('Bleaching collect record validation: user can dismiss percent cover observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_quadrat_benthic_percent: [
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const percentCoverObservationTable = screen.getByTestId('observations2-section-table')

  expect(within(percentCoverObservationTable).getByText('firstWarning')).toBeInTheDocument()
  expect(within(percentCoverObservationTable).getByText('secondWarning')).toBeInTheDocument()

  await user.click(within(percentCoverObservationTable).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(
      within(percentCoverObservationTable).queryByText('firstWarning'),
    ).not.toBeInTheDocument(),
  )
  expect(within(percentCoverObservationTable).queryByText('secondWarning')).not.toBeInTheDocument()

  expect(within(percentCoverObservationTable).getByTestId('ignore-warning-checkbox')).toBeChecked()
  expect(
    within(percentCoverObservationTable).getByTestId('ignore-warning-label'),
  ).toBeInTheDocument()

  const isFormDirtyAfterIgnore = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterIgnore)
}, 60000)

test('Bleaching collect record validation: user can reset dismissed non-observation input warnings', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
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
              quadrat_collection: {
                quadrat_size: [
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
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
  const quadratSizeRow = screen.getByTestId('quadrat-size')
  const labelRow = screen.getByTestId('label')
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
  expect(within(quadratSizeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(labelRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(visibilityRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(currentRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(tideRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(notesRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(observersRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

  await user.click(await within(siteRow).findByTestId('ignore-warning-checkbox'))

  const isFormDirtyAfterReset = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterReset)

  await waitFor(() =>
    expect(within(siteRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(siteRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(siteRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(siteRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(managementRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(managementRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )

  expect(within(managementRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(managementRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(managementRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(depthRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(depthRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(depthRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(depthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(depthRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(sampleDateRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(sampleDateRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(sampleDateRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(sampleTimeRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(sampleTimeRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(sampleTimeRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(quadratSizeRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(quadratSizeRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(quadratSizeRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(quadratSizeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(
    within(quadratSizeRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(labelRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(labelRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(labelRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(labelRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(labelRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(relativeDepthRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(relativeDepthRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(relativeDepthRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(relativeDepthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(
    within(relativeDepthRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(visibilityRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(visibilityRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(visibilityRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(visibilityRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(visibilityRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(currentRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(currentRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(currentRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(currentRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(currentRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(tideRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(tideRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(tideRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(tideRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(tideRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(notesRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(notesRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(notesRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(notesRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(notesRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(observersRow).getByTestId('ignore-warning-checkbox'))

  await waitFor(() =>
    expect(within(observersRow).queryByTestId('message-pill-ignore')).not.toBeInTheDocument(),
  )
  expect(within(observersRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(observersRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observersRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()
}, 50000)
