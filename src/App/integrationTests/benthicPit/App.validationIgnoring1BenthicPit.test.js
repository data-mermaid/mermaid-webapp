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
import mockBenthicPitCollectRecords from '../../../testUtilities/mockCollectRecords/mockBenthicPitCollectRecords'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Benthic PIT validation: user can dismiss non-observations input warnings ', async () => {
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
              interval_start: [
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
              obs_benthic_pits: [],
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
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
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
  const intervalSizeRow = screen.getByTestId('interval_size')
  const intervalStartRow = screen.getByTestId('interval_start')
  const reefSlopeRow = screen.getByTestId('reef_slope')
  const relativeDepthRow = screen.getByTestId('relative_depth')
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
  expect(within(intervalStartRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(intervalStartRow).getByText('secondWarning')).toBeInTheDocument()
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

  userEvent.click(within(siteRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() => expect(within(siteRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(siteRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(siteRow).getByRole('button', { name: 'Reset validations' }))
  expect(within(siteRow).getByText('Ignored'))

  const isFormDirtyAfterIgnore = await screen.findByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterIgnore)
  userEvent.click(within(managementRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(managementRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(managementRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(managementRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(depthRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() => expect(within(depthRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(depthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(depthRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(sampleDateRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(sampleDateRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sampleDateRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(sampleTimeRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(sampleTimeRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sampleTimeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(transectNumberRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(transectNumberRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(transectNumberRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(labelRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() => expect(within(labelRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(labelRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(labelRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(lengthSurveyedRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(lengthSurveyedRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(lengthSurveyedRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(intervalSizeRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(intervalSizeRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(intervalSizeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(intervalSizeRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(intervalStartRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(intervalStartRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(intervalStartRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(intervalStartRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(reefSlopeRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(reefSlopeRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(reefSlopeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(relativeDepthRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(relativeDepthRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(relativeDepthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(relativeDepthRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(visibilityRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(visibilityRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(visibilityRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(visibilityRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(currentRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(currentRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(currentRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(currentRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(tideRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() => expect(within(tideRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(tideRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(tideRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(notesRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() => expect(within(notesRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(notesRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(notesRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(observersRow).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(observersRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observersRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observersRow).getByText('Ignored')).toBeInTheDocument()
}, 50000)

test('Benthic PIT validation: user can dismiss record-level warnings ', async () => {
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

      return res(ctx.json(response))
    }),
  )

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  userEvent.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  expect(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))

  const recordLevelValidationsSection = screen.getByTestId('record-level-validations')

  expect(within(recordLevelValidationsSection).getByText('warning')).toBeInTheDocument()

  userEvent.click(
    within(recordLevelValidationsSection).getByRole('button', { name: 'Ignore Warning' }),
  )

  await waitFor(() =>
    expect(within(recordLevelValidationsSection).queryByText('warning')).not.toBeInTheDocument(),
  )
  expect(within(recordLevelValidationsSection).getByText('ignored')).toBeInTheDocument()

  userEvent.click(
    within(recordLevelValidationsSection).getByRole('button', { name: 'Reset validation' }),
  )
  expect(await within(recordLevelValidationsSection).findByText('warning')).toBeInTheDocument()
  await waitFor(() =>
    expect(within(recordLevelValidationsSection).queryByText('ignored')).not.toBeInTheDocument(),
  )

  const isFormDirtyAfterIgnore = await screen.findByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterIgnore)
}, 50000)

test('Benthic PIT validation: user can dismiss observation warnings ', async () => {
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

      return res(ctx.json(response))
    }),
  )

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  userEvent.click(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))
  expect(await screen.findByRole('button', { name: 'Validating' }))
  expect(await screen.findByRole('button', { name: 'Validate' }, { timeout: 10000 }))

  const observationsTable = screen.getByLabelText('Observations')

  expect(within(observationsTable).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observationsTable).getByText('secondWarning')).toBeInTheDocument()

  userEvent.click(within(observationsTable).getByRole('button', { name: 'Ignore warning' }))

  await waitFor(() =>
    expect(within(observationsTable).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observationsTable).queryByText('secondWarning')).not.toBeInTheDocument()

  expect(within(observationsTable).getByRole('button', { name: 'Reset validations' }))
  expect(within(observationsTable).getByText('Ignored'))

  const isFormDirtyAfterIgnore = await screen.findByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterIgnore)
}, 60000)

test('Benthic PIT validation: user can reset dismissed non-observation input warnings', async () => {
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

      return res(ctx.json(response))
    }),
  )

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
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
  const intervalSizeRow = screen.getByTestId('interval_size')
  const intervalStartRow = screen.getByTestId('interval_start')
  const reefSlopeRow = screen.getByTestId('reef_slope')
  const relativeDepthRow = screen.getByTestId('relative_depth')
  const visibilityRow = screen.getByTestId('visibility')
  const currentRow = screen.getByTestId('current')
  const tideRow = screen.getByTestId('tide')
  const notesRow = screen.getByTestId('notes')
  const observersRow = screen.getByTestId('observers')

  userEvent.click(
    await within(siteRow).findByRole('button', {
      name: 'Reset validations',
    }),
  )

  const isFormDirtyAfterReset = await screen.findByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterReset)

  await waitFor(() => expect(within(siteRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(siteRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(siteRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(siteRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(managementRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(managementRow).queryByText('Ignored')).not.toBeInTheDocument())

  expect(within(managementRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(managementRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(managementRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(depthRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(depthRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(depthRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(depthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(depthRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(sampleDateRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(sampleDateRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(sampleDateRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(sampleTimeRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(sampleTimeRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(sampleTimeRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(transectNumberRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(transectNumberRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(transectNumberRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(transectNumberRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(labelRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(labelRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(labelRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(labelRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(labelRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(lengthSurveyedRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(lengthSurveyedRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(lengthSurveyedRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(lengthSurveyedRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(intervalSizeRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(intervalSizeRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(intervalSizeRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(intervalSizeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(intervalSizeRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(intervalStartRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(intervalStartRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(intervalStartRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(intervalStartRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(intervalStartRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(reefSlopeRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(reefSlopeRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(reefSlopeRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(reefSlopeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(reefSlopeRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(relativeDepthRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(relativeDepthRow).queryByText('Ignored')).not.toBeInTheDocument(),
  )
  expect(within(relativeDepthRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(relativeDepthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(relativeDepthRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(visibilityRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(visibilityRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(visibilityRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(visibilityRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(visibilityRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(currentRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(currentRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(currentRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(currentRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(currentRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(tideRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(tideRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(tideRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(tideRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(tideRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(notesRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(notesRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(notesRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(notesRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(notesRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()

  userEvent.click(
    within(observersRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(observersRow).queryByText('Ignored')).not.toBeInTheDocument())
  expect(within(observersRow).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(observersRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observersRow).queryByLabelText('Passed Validation')).not.toBeInTheDocument()
}, 50000)