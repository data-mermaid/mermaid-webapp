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

test('Bleaching validation: user can reset ignored observation warnings (colonies bleached) ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
  const observationsValidations = [
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
  ]

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
              obs_colonies_bleached: observationsValidations,
              obs_quadrat_benthic_percent: observationsValidations,
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

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const coloniesBleachedObservationTable = screen.getByTestId('observations-section-table')

  // only one observation will have warnings

  await waitFor(() =>
    expect(
      within(coloniesBleachedObservationTable).queryByText('firstWarning'),
    ).not.toBeInTheDocument(),
  )
  expect(
    within(coloniesBleachedObservationTable).queryByText('secondWarning'),
  ).not.toBeInTheDocument()
  expect(within(coloniesBleachedObservationTable).getByText('Ignored')).toBeInTheDocument()

  // other two passing
  expect(
    within(coloniesBleachedObservationTable).queryAllByLabelText('Passed Validation').length,
  ).toEqual(2)

  await user.click(
    within(coloniesBleachedObservationTable).getByRole('checkbox', { name: 'Ignore warning' }),
  )

  const isFormDirtyAfterReset = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterReset)

  await waitFor(() =>
    expect(within(coloniesBleachedObservationTable).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(
    within(coloniesBleachedObservationTable).queryByText('firstWarning'),
  ).not.toBeInTheDocument()
  expect(
    within(coloniesBleachedObservationTable).queryByText('secondWarning'),
  ).not.toBeInTheDocument()
  expect(
    within(coloniesBleachedObservationTable).queryAllByLabelText('Passed Validation').length,
  ).toEqual(2)
})

test('Bleaching validation: user can reset ignored observation warnings (percent cover) ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
  const observationsValidations = [
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
  ]

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
              obs_colonies_bleached: observationsValidations,
              obs_quadrat_benthic_percent: observationsValidations,
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

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const percentCoverObservationTable = screen.getByTestId('observations2-section-table')

  // only one observation will have warnings

  await waitFor(() =>
    expect(
      within(percentCoverObservationTable).queryByText('firstWarning'),
    ).not.toBeInTheDocument(),
  )
  expect(within(percentCoverObservationTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(percentCoverObservationTable).getByText('Ignored')).toBeInTheDocument()

  // other two passing
  expect(
    within(percentCoverObservationTable).queryAllByLabelText('Passed Validation').length,
  ).toEqual(2)

  await user.click(
    within(percentCoverObservationTable).getByRole('checkbox', { name: 'Ignore warning' }),
  )

  const isFormDirtyAfterReset = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterReset)

  await waitFor(() =>
    expect(within(percentCoverObservationTable).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(percentCoverObservationTable).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(percentCoverObservationTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(
    within(percentCoverObservationTable).queryAllByLabelText('Passed Validation').length,
  ).toEqual(2)
})

test('user can reset dismissed record-level warnings', async () => {
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
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

test('Bleaching validation: user edits non-observation input with ignored validation resets the ignored status for that input.', async () => {
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
              quadrat_collection: {
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
  const labelRow = screen.getByTestId('label')
  const quadratSizeRow = screen.getByTestId('quadrat-size')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')

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
  expect(within(labelRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(labelRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(quadratSizeRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(notesRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(notesRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(observersRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(observersRow).getAllByText('ignored')[1]).toBeInTheDocument()

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

  await user.type(within(labelRow).getByTestId('label-input'), '1')
  await waitFor(() => expect(within(labelRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(quadratSizeRow).getByTestId('quadrat-size-input'), '1')
  await waitFor(() => expect(within(quadratSizeRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(notesRow).getByTestId('notes-textarea'), '1')
  await waitFor(() => expect(within(notesRow).queryByText('Ignored')).not.toBeInTheDocument())

  const observerSelect = within(observersRow).getByTestId('observers-select')

  await user.click(within(observerSelect).getByText('Melissa Nunes'))
  await waitFor(() => expect(within(observersRow).queryByText('Ignored')).not.toBeInTheDocument())

  // make act error go away
  expect(
    await within(screen.getByTestId('collect-record-form-buttons')).findByTestId('save-button'),
  ).toBeEnabled()
})
