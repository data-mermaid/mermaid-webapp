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
import mockBenthicPitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicPitCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Benthic PIT validation: user can reset ignored observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicPitCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_benthic_pits: [
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
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  await waitFor(() =>
    expect(
      screen.getByRole('button', {
        name: 'Validate',
      }),
    ),
  )

  const observationsTable = screen.getByLabelText('Observations')

  // only one observation will have warnings

  await waitFor(() =>
    expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).getByText('Ignored')).toBeInTheDocument()

  // other two passing
  expect(within(observationsTable).queryAllByLabelText('Passed Validation').length).toEqual(2)

  await user.click(within(observationsTable).getByRole('checkbox', { name: 'Ignore warning' }))

  const isFormDirtyAfterReset = await screen.findByRole('button', { name: 'Save' })

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
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicPitCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  await waitFor(() =>
    expect(
      screen.getByRole('button', {
        name: 'Validate',
      }),
    ),
  )

  const recordLevelValidationsSection = screen.getByTestId('record-level-validations')

  expect(within(recordLevelValidationsSection).getByText('ignored')).toBeInTheDocument()

  await user.click(
    await within(recordLevelValidationsSection).findByRole('checkbox', { name: 'Ignore warning' }),
  )

  await waitFor(() =>
    expect(within(recordLevelValidationsSection).queryByText('ignored')).not.toBeInTheDocument(),
  )
  expect(within(recordLevelValidationsSection).getByText('warning')).toBeInTheDocument()

  const isFormDirtyAfterReset = screen.getByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterReset)
})

test('Benthic PIT validation: user edits non-observation input with ignored validation resets the ignored status for that input.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBenthicPitCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              interval_start: [
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
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  await waitFor(() =>
    expect(
      screen.getByRole('button', {
        name: 'Validate',
      }),
    ),
  )

  const siteRow = screen.getByTestId('site')
  const managementRow = screen.getByTestId('management')
  const depthRow = screen.getByTestId('depth')
  const sampleDateRow = screen.getByTestId('sample_date')
  const sampleTimeRow = screen.getByTestId('sample_time')
  const transectNumberRow = screen.getByTestId('transect_number')
  const labelRow = screen.getByTestId('label')
  const lengthSurveyedRow = screen.getByTestId('len_surveyed')
  const intervalSizeRow = screen.getByTestId('interval_size')
  const intervalStartRow = screen.getByTestId('interval_start')
  const reefSlopeRow = screen.getByTestId('reef_slope')
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
  expect(within(transectNumberRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(transectNumberRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(labelRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(labelRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(intervalSizeRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(intervalSizeRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(intervalStartRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(intervalStartRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(reefSlopeRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(notesRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(notesRow).getAllByText('ignored')[1]).toBeInTheDocument()
  expect(within(observersRow).getAllByText('ignored')[0]).toBeInTheDocument()
  expect(within(observersRow).getAllByText('ignored')[1]).toBeInTheDocument()

  await user.selectOptions(within(siteRow).getByLabelText('Site'), '1')
  await waitFor(() => expect(within(siteRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.selectOptions(within(managementRow).getByLabelText('Management'), '1')
  await waitFor(() => expect(within(managementRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(depthRow).getByLabelText('Depth'), '1')
  await waitFor(() => expect(within(depthRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(sampleDateRow).getByLabelText('Sample Date'), '2021-11-09')
  await waitFor(() => expect(within(sampleDateRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(sampleTimeRow).getByLabelText('Sample Time'), '02:39 PM')
  await waitFor(() => expect(within(sampleTimeRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(transectNumberRow).getByLabelText('Transect Number'), '12')
  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  await user.type(within(labelRow).getByLabelText('Label'), '1')
  await waitFor(() => expect(within(labelRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(lengthSurveyedRow).getByLabelText('Transect Length Surveyed'), '1')
  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  await user.type(within(intervalSizeRow).getByLabelText('Interval Size'), '10')
  await waitFor(() =>
    expect(within(intervalSizeRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  await user.type(within(intervalStartRow).getByLabelText('Interval Start'), '10')
  await waitFor(() =>
    expect(within(intervalStartRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  // Reef Slope select on crest
  await user.selectOptions(
    within(reefSlopeRow).getByLabelText('Reef Slope'),
    '12dc11ae-3a4b-4309-8fae-66f51398d96f',
  )
  await waitFor(() => expect(within(reefSlopeRow).queryByText('Ignored')).not.toBeInTheDocument())

  await user.type(within(notesRow).getByLabelText('Notes'), '1')
  await waitFor(() => expect(within(notesRow).queryByText('Ignored')).not.toBeInTheDocument())

  const observersList = within(observersRow).getByLabelText('Observers')

  await user.click(within(observersList).getByText('Melissa Nunes'))
  await waitFor(() => expect(within(observersRow).queryByText('Ignored')).not.toBeInTheDocument())

  // make act error go away
  expect(
    await within(screen.getByTestId('collect-record-form-buttons')).findByText('Save'),
  ).toBeEnabled()
})
