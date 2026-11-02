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
import mockBenthicPhotoQuadratCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicPhotoQuadratCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Benthic Photo Quadrat validation: user can dismiss non-observations input warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBenthicPhotoQuadratCollectRecords[0],
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
              quadrat_transect: {
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
                num_quadrats: [
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
                num_points_per_quadrat: [
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
                quadrat_number_start: [
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
              },
              obs_benthic_photo_quadrats: [],
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
      initialEntries: ['/projects/5/collecting/benthicpqt/90'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const currentRow = screen.getByTestId('current')
  const depthRow = screen.getByTestId('depth')
  const labelRow = screen.getByTestId('label')
  const lengthSurveyedRow = screen.getByTestId('len-surveyed')
  const managementRow = screen.getByTestId('management')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')
  const relativeDepthRow = screen.getByTestId('relative-depth')
  const sampleDateRow = screen.getByTestId('sample-date')
  const sampleTimeRow = screen.getByTestId('sample-time')
  const siteRow = screen.getByTestId('site')
  const tideRow = screen.getByTestId('tide')
  const transectNumberRow = screen.getByTestId('transect-number')
  const visibilityRow = screen.getByTestId('visibility')
  const quadratNumberStartRow = screen.getByTestId('quadrat-number-start')
  const quadratSizeRow = screen.getByTestId('quadrat-size')
  const numberOfQuadratsRow = screen.getByTestId('num-quadrats')
  const numberOfPointsPerQuadratRow = screen.getByTestId('num-points-per-quadrat')
  const reefSlopeRow = screen.getByTestId('reef-slope')

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
  expect(within(quadratNumberStartRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(quadratNumberStartRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(quadratSizeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(quadratSizeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(numberOfPointsPerQuadratRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(numberOfPointsPerQuadratRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('secondWarning')).toBeInTheDocument()

  await user.click(within(siteRow).getAllByTestId('ignore-warning-checkbox')[0])

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

  await user.click(within(relativeDepthRow).getAllByTestId('ignore-warning-checkbox')[0])
  await waitFor(() =>
    expect(within(relativeDepthRow).getAllByTestId('message-pill-warning')).toHaveLength(1),
  )
  expect(within(relativeDepthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(1)

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

  await user.click(within(quadratNumberStartRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(quadratNumberStartRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(quadratNumberStartRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(quadratNumberStartRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(quadratNumberStartRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(quadratSizeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(quadratSizeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(quadratSizeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(quadratSizeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(numberOfQuadratsRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(numberOfQuadratsRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(numberOfQuadratsRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(numberOfPointsPerQuadratRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(numberOfPointsPerQuadratRow).getAllByTestId('message-pill-ignore')).toHaveLength(
      1,
    ),
  )
  expect(within(numberOfPointsPerQuadratRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(numberOfPointsPerQuadratRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(numberOfPointsPerQuadratRow).getAllByTestId('message-pill-warning')).toHaveLength(1)

  await user.click(within(reefSlopeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(reefSlopeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
}, 50000)

test('Benthic Photo Quadrat validation: user can dismiss record-level warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBenthicPhotoQuadratCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/benthicpqt/90'],
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

test('Benthic Photo Quadrat validation: user can dismiss observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBenthicPhotoQuadratCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_benthic_photo_quadrats: [
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
      initialEntries: ['/projects/5/collecting/benthicpqt/90'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button', { timeout: 10000 }))
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const observationsTable = screen.getByTestId('observations-section')

  await waitFor(() =>
    expect(within(observationsTable).getByText('firstWarning')).toBeInTheDocument(),
  )
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

test('Benthic Photo Quadrat validation: user can reset dismissed non-observation input warnings', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBenthicPhotoQuadratCollectRecords[0],
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
              quadrat_transect: {
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
                num_quadrats: [
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
                num_points_per_quadrat: [
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
                quadrat_number_start: [
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
      initialEntries: ['/projects/5/collecting/benthicpqt/90'],
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
  const relativeDepthRow = screen.getByTestId('relative-depth')
  const visibilityRow = screen.getByTestId('visibility')
  const currentRow = screen.getByTestId('current')
  const tideRow = screen.getByTestId('tide')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')
  const quadratNumberStartRow = screen.getByTestId('quadrat-number-start')
  const quadratSizeRow = screen.getByTestId('quadrat-size')
  const numberOfQuadratsRow = screen.getByTestId('num-quadrats')
  const numberOfPointsPerQuadratRow = screen.getByTestId('num-points-per-quadrat')
  const reefSlopeRow = screen.getByTestId('reef-slope')

  expect(within(siteRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(siteRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(managementRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(managementRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(depthRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(depthRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(sampleDateRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(sampleDateRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(sampleTimeRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(sampleTimeRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(transectNumberRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(transectNumberRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(labelRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(labelRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(visibilityRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(visibilityRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(currentRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(currentRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(tideRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(tideRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(notesRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(notesRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(observersRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(observersRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(quadratNumberStartRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(quadratNumberStartRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()
  expect(
    within(numberOfPointsPerQuadratRow).getAllByTestId('message-pill-ignore')[0],
  ).toBeInTheDocument()
  expect(
    within(numberOfPointsPerQuadratRow).getAllByTestId('message-pill-ignore')[1],
  ).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')[0]).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')[1]).toBeInTheDocument()

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
    expect(within(labelRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(labelRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
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

  await user.click(within(relativeDepthRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(relativeDepthRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(relativeDepthRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(relativeDepthRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(
    within(relativeDepthRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(reefSlopeRow).getAllByTestId('ignore-warning-checkbox')[0])
  await waitFor(() =>
    expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(reefSlopeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(reefSlopeRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(within(reefSlopeRow).queryByTestId('passed-validation-indicator')).not.toBeInTheDocument()

  await user.click(within(visibilityRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(visibilityRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(visibilityRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
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

  await waitFor(() => expect(within(tideRow).getAllByTestId('message-pill-ignore')).toHaveLength(1))
  expect(within(tideRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
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

  await user.click(within(quadratNumberStartRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(quadratNumberStartRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(quadratNumberStartRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(
    within(quadratNumberStartRow).getAllByTestId('ignore-warning-checkbox')[0],
  ).not.toBeChecked()
  expect(
    within(quadratNumberStartRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(quadratSizeRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(quadratSizeRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(quadratSizeRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(quadratSizeRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(
    within(quadratSizeRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(numberOfQuadratsRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(numberOfQuadratsRow).getAllByTestId('message-pill-ignore')).toHaveLength(1),
  )
  expect(within(numberOfQuadratsRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(within(numberOfQuadratsRow).getAllByTestId('ignore-warning-checkbox')[0]).not.toBeChecked()
  expect(
    within(numberOfQuadratsRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()

  await user.click(within(numberOfPointsPerQuadratRow).getAllByTestId('ignore-warning-checkbox')[0])

  await waitFor(() =>
    expect(within(numberOfPointsPerQuadratRow).getAllByTestId('message-pill-ignore')).toHaveLength(
      1,
    ),
  )
  expect(within(numberOfPointsPerQuadratRow).getAllByTestId('message-pill-warning')).toHaveLength(1)
  expect(
    within(numberOfPointsPerQuadratRow).getAllByTestId('ignore-warning-checkbox')[0],
  ).not.toBeChecked()
  expect(
    within(numberOfPointsPerQuadratRow).queryByTestId('passed-validation-indicator'),
  ).not.toBeInTheDocument()
}, 50000)
