import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Validation: user can reset ignored observation warnings ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_belt_fishes: [
                [
                  {
                    context: { observation_id: '9' },
                    name: 'firstWarning',
                    status: 'ignore',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: '9' },
                    name: 'secondWarning',
                    status: 'ignore',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                  {
                    context: { observation_id: 'not9' },
                    name: 'thirdOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                ],
                [
                  {
                    context: { observation_id: 'not9' },
                    name: 'firstOtherObservationWarning',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    context: { observation_id: 'not9' },
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

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  userEvent.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  expect(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))

  const observationsTable = screen.getByLabelText('Observations')

  // only one observation will have warnings

  await waitFor(() =>
    expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).getByText('Ignored')).toBeInTheDocument()

  // other two passing
  expect(within(observationsTable).queryAllByLabelText('passed-validation').length).toEqual(2)

  userEvent.click(within(observationsTable).getByRole('button', { name: 'Reset validations' }))

  const isFormDirtyAfterReset = await screen.findByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterReset)

  await waitFor(() =>
    expect(within(observationsTable).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observationsTable).queryAllByLabelText('passed-validation').length).toEqual(2)
})

test('user can reset dismissed record-level warnings', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
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

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  userEvent.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  expect(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))

  const recordLevelValidationsSection = screen.getByTestId('record-level-validations')

  expect(within(recordLevelValidationsSection).getByText('ignored')).toBeInTheDocument()

  userEvent.click(
    await within(recordLevelValidationsSection).findByRole('button', {
      name: 'Reset validation',
    }),
  )

  await waitFor(() =>
    expect(within(recordLevelValidationsSection).queryByText('ignored')).not.toBeInTheDocument(),
  )
  expect(within(recordLevelValidationsSection).getByText('warning')).toBeInTheDocument()

  const isFormDirtyAfterReset = screen.getByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterReset)
})

test('Validation: user edits non-observation input with ignored validation resets the ignored status for that input.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
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
              fishbelt_transect: {
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

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  userEvent.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  expect(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))

  const siteRow = screen.getByTestId('site')
  const managementRow = screen.getByTestId('management')
  const depthRow = screen.getByTestId('depth')
  const sampleDateRow = screen.getByTestId('sample_date')
  const sampleTimeRow = screen.getByTestId('sample_time')
  const transectNumberRow = screen.getByTestId('transect_number')
  const labelRow = screen.getByTestId('label')
  const lengthSurveyedRow = screen.getByTestId('len_surveyed')
  const widthRow = screen.getByTestId('width')
  const sizeBinRow = screen.getByTestId('size_bin')
  const reefSlopeRow = screen.getByTestId('reef_slope')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')

  expect(within(siteRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(managementRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(depthRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(sampleDateRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(sampleTimeRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(transectNumberRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(labelRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(lengthSurveyedRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(widthRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(sizeBinRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(notesRow).getByText('Ignored')).toBeInTheDocument()
  expect(within(observersRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.selectOptions(within(siteRow).getByLabelText('Site'), '1')
  await waitFor(() => expect(within(siteRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.selectOptions(within(managementRow).getByLabelText('Management'), '1')
  await waitFor(() => expect(within(managementRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.type(within(depthRow).getByLabelText('Depth'), '1')
  await waitFor(() => expect(within(depthRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.type(within(sampleDateRow).getByLabelText('Sample Date'), '2021-11-09')
  await waitFor(() => expect(within(sampleDateRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.type(within(sampleTimeRow).getByLabelText('Sample Time'), '02:39 PM')
  await waitFor(() => expect(within(sampleTimeRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.type(within(transectNumberRow).getByLabelText('Transect Number'), '12')
  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  userEvent.type(within(labelRow).getByLabelText('Label'), '1')
  await waitFor(() => expect(within(labelRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.type(within(lengthSurveyedRow).getByLabelText('Transect Length Surveyed'), '1')
  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )

  userEvent.click(within(widthRow).getByLabelText('10m'))
  await waitFor(() => expect(within(widthRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.click(within(sizeBinRow).getByLabelText('AGRRA'))
  await waitFor(() => expect(within(sizeBinRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.click(within(reefSlopeRow).getByLabelText('crest'))
  await waitFor(() => expect(within(reefSlopeRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.type(within(notesRow).getByLabelText('Notes'), '1')
  await waitFor(() => expect(within(notesRow).queryByText('Ignored')).not.toBeInTheDocument())

  userEvent.click(within(observersRow).getByLabelText('Melissa Nunes'))
  await waitFor(() => expect(within(observersRow).queryByText('Ignored')).not.toBeInTheDocument())

  // make act error go away
  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })))
})
