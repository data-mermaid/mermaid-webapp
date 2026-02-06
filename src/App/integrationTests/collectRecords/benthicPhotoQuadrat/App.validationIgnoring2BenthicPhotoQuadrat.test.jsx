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

test('Benthic photo quadrat validation: user can reset ignored observation warnings ', async () => {
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
                    name: 'firstWarning',
                    status: 'ignore',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: '1' },
                    name: 'secondWarning',
                    status: 'ignore',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                  {
                    context: { observation_id: 'not1' },
                    name: 'thirdOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                ],
                [
                  {
                    context: { observation_id: 'not1' },
                    name: 'firstOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: 'not1' },
                    name: 'secondOtherObservationWarning',
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

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const observationsTable = screen.getByTestId('observations-section')

  // only one observation will have warnings

  await waitFor(() =>
    expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).getByText('Ignored')).toBeInTheDocument()

  // other two passing
  expect(within(observationsTable).queryAllByLabelText('Passed Validation').length).toEqual(2)

  await user.click(within(observationsTable).getByRole('checkbox', { name: 'Ignore warning' }))

  const isFormDirtyAfterReset = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterReset)

  await waitFor(() =>
    expect(within(observationsTable).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).queryAllByLabelText('Passed Validation').length).toEqual(2)
})

test('user can reset dismissed record-level warnings', async () => {
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
                name: 'record level ignore',
                status: 'ignore',
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

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const recordLevelValidationsSection = screen.getByTestId('record-level-validations')

  expect(within(recordLevelValidationsSection).getByText('ignored')).toBeInTheDocument()

  await user.click(
    await within(recordLevelValidationsSection).findByRole('checkbox', { name: 'Ignore warning' }),
  )

  await waitFor(() =>
    expect(within(recordLevelValidationsSection).queryByText('ignored')).not.toBeInTheDocument(),
  )
  expect(within(recordLevelValidationsSection).getByText('warning')).toBeInTheDocument()

  const isFormDirtyAfterReset = screen.getByTestId('save-button')

  expect(isFormDirtyAfterReset)
})

test('Benthic photo quadrat validation: user edits non-observation input with ignored validation resets the ignored status for that input.', async () => {
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
                },
                {
                  validation_id: Math.random(),
                  name: 'secondWarning',
                  status: 'ignore',
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
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
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

  expect(within(siteRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(siteRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(managementRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(managementRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(depthRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(depthRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(sampleDateRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(sampleDateRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(sampleTimeRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(sampleTimeRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(transectNumberRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(transectNumberRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(labelRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(labelRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(relativeDepthRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(relativeDepthRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(visibilityRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(visibilityRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(currentRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(currentRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(tideRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(tideRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(notesRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(notesRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(observersRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(observersRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(quadratNumberStartRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(quadratNumberStartRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(numberOfQuadratsRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(numberOfPointsPerQuadratRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(numberOfPointsPerQuadratRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByText('ignored')[1]).toBeInTheDocument()

  await user.selectOptions(within(siteRow).getByTestId('site-select'), '1')
  await waitFor(() => expect(within(siteRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.selectOptions(within(managementRow).getByTestId('management-select'), '1')
  await waitFor(() => expect(within(managementRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(depthRow).getByTestId('depth-input'), '1')
  await waitFor(() => expect(within(depthRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(sampleDateRow).getByTestId('sample-date-input'), '2021-11-09')
  await waitFor(() => expect(within(sampleDateRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(sampleTimeRow).getByTestId('sample-time-input'), '02:39 PM')
  await waitFor(() => expect(within(sampleTimeRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(transectNumberRow).getByTestId('transect-number-input'), '12')
  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  await user.type(within(labelRow).getByTestId('label-input'), '1')
  await waitFor(() => expect(within(labelRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(lengthSurveyedRow).getByTestId('len-surveyed-input'), '1')
  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  // Relative Depth select on shallow
  await user.selectOptions(
    within(relativeDepthRow).getByTestId('relative-depth-select'),
    'e88cc7bc-bdeb-49cf-b211-99f28c3cd2c3',
  )
  await waitFor(() =>
    expect(within(relativeDepthRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  // Visibility select on <1m - bad
  await user.selectOptions(
    within(visibilityRow).getByTestId('visibility-select'),
    '40702fad-754a-4982-8ca5-9b97106eca31',
  )
  await waitFor(() => expect(within(visibilityRow).queryByText('Ignored')).not.toBeInTheDocument())

  // Current select on moderate
  await user.selectOptions(
    within(currentRow).getByTestId('current-select'),
    '60e11188-60d7-4f83-9658-27eb5a09c803',
  )
  await waitFor(() => expect(within(currentRow).queryByText('Ignored')).not.toBeInTheDocument())

  // Tide select on low
  await user.selectOptions(
    within(tideRow).getByTestId('tide-select'),
    'bca0273a-51a3-4274-8425-457ca3afcfea',
  )
  await waitFor(() => expect(within(tideRow).queryByText('Ignored')).not.toBeInTheDocument())

  // Reef Slope select on crest
  await user.selectOptions(
    within(reefSlopeRow).getByTestId('reef-slope-select'),
    '12dc11ae-3a4b-4309-8fae-66f51398d96f',
  )
  await waitFor(() => expect(within(reefSlopeRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(notesRow).getByTestId('notes-textarea'), '1')
  await waitFor(() => expect(within(notesRow).queryByText('Ignored')).not.toBeInTheDocument())

  const observerSelect = within(observersRow).getByTestId('observers-select')

  await user.click(within(observerSelect).getByText('Melissa Nunes'))
  await waitFor(() => expect(within(observersRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(quadratNumberStartRow).getByTestId('quadrat-number-start-input'), '99')
  await waitFor(() =>
    expect(within(quadratNumberStartRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  await user.type(within(quadratSizeRow).getByTestId('quadrat-size-input'), '99')
  await waitFor(() => expect(within(quadratSizeRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(numberOfQuadratsRow).getByTestId('num-quadrats-input'), '99')
  await waitFor(() =>
    expect(within(numberOfQuadratsRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  await user.type(
    within(numberOfPointsPerQuadratRow).getByTestId('num-points-per-quadrat-input'),
    '99',
  )
  await waitFor(() =>
    expect(within(numberOfPointsPerQuadratRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  // make act error go away
  expect(
    await within(screen.getByTestId('collect-record-form-buttons')).findByTestId('save-button'),
  ).toBeEnabled()
})
