import '@testing-library/jest-dom'
import React from 'react'

import { rest } from 'msw'
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
import mockBenthicLitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Benthic LIT validation: user can reset ignored observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicLitCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_benthic_lits: [
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

      return res(ctx.json(response))
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
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
  expect(within(observationsTable).getByTestId('ignore-warning-label')).toBeInTheDocument()

  // other two passing
  expect(within(observationsTable).queryAllByTestId('passed-validation-indicator').length).toEqual(
    2,
  )

  await user.click(within(observationsTable).getByTestId('ignore-warning-checkbox'))

  const isFormDirtyAfterReset = await screen.findByTestId('save-button')

  expect(isFormDirtyAfterReset)

  await waitFor(() =>
    expect(within(observationsTable).queryByTestId('ignore-warning-label')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).queryAllByTestId('passed-validation-indicator').length).toEqual(
    2,
  )
})

test('user can reset dismissed record-level warnings', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicLitCollectRecords[0],
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

      return res(ctx.json(response))
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const recordLevelValidationsSection = screen.getByTestId('record-level-validations')

  expect(
    within(recordLevelValidationsSection).getByTestId('message-pill-ignore'),
  ).toBeInTheDocument()

  await user.click(
    await within(recordLevelValidationsSection).findByTestId('ignore-warning-checkbox'),
  )

  await waitFor(() =>
    expect(
      within(recordLevelValidationsSection).queryByTestId('message-pill-ignore'),
    ).not.toBeInTheDocument(),
  )
  expect(
    within(recordLevelValidationsSection).getByTestId('message-pill-warning'),
  ).toBeInTheDocument()

  const isFormDirtyAfterReset = screen.getByTestId('save-button')

  expect(isFormDirtyAfterReset)
})

test('Benthic LIT validation: user edits non-observation input with ignored validation resets the ignored status for that input.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicLitCollectRecords[0],
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

      return res(ctx.json(response))
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
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
  const reefSlopeRow = screen.getByTestId('reef-slope')
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
  expect(within(reefSlopeRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(notesRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)
  expect(within(observersRow).getAllByTestId('message-pill-ignore')).toHaveLength(2)

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

  // make act error go away
  expect(
    await within(screen.getByTestId('collect-record-form-buttons')).findByTestId('save-button'),
  ).toBeEnabled()
})
