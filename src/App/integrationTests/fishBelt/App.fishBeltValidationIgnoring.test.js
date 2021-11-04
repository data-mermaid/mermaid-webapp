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
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Validation: user can dismiss warnings ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

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
              fishbelt_transect: {
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
    <App dexieInstance={dexieInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexieInstance,
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
  expect(within(widthRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(widthRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(sizeBinRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(sizeBinRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(notesRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(notesRow).getByText('secondWarning')).toBeInTheDocument()
  expect(within(observersRow).getByText('firstWarning')).toBeInTheDocument()
  expect(within(observersRow).getByText('secondWarning')).toBeInTheDocument()

  userEvent.click(within(siteRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() => expect(within(siteRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(siteRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(siteRow).getByRole('button', { name: 'Reset validations' }))
  expect(within(siteRow).getByText('Ignored'))

  const isFormDirtyAfterIgnore = await screen.findByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterIgnore)
  userEvent.click(within(managementRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(managementRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(managementRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(managementRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(depthRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() => expect(within(depthRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(depthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(depthRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(sampleDateRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(sampleDateRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sampleDateRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(sampleTimeRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(sampleTimeRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sampleTimeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(transectNumberRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(transectNumberRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(transectNumberRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(labelRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() => expect(within(labelRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(labelRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(labelRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(lengthSurveyedRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(lengthSurveyedRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(lengthSurveyedRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(widthRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() => expect(within(widthRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(widthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(widthRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(sizeBinRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(sizeBinRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sizeBinRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sizeBinRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(reefSlopeRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(reefSlopeRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(reefSlopeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(reefSlopeRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(notesRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() => expect(within(notesRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(notesRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(notesRow).getByText('Ignored')).toBeInTheDocument()

  userEvent.click(within(observersRow).getByRole('button', { name: 'Ignore all warnings' }))

  await waitFor(() =>
    expect(within(observersRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observersRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observersRow).getByText('Ignored')).toBeInTheDocument()
})

test('user can reset dismissed warnings', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

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
                  code: 'firstWarning',
                  status: 'ignore',
                },
                {
                  validation_id: Math.random(),
                  code: 'secondWarning',
                  status: 'ignore',
                },
              ],
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                management: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                sample_date: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                notes: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
              },
              fishbelt_transect: {
                depth: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                sample_time: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                number: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                label: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                len_surveyed: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                width: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                size_bin: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
                    status: 'ignore',
                  },
                ],
                reef_slope: [
                  {
                    validation_id: Math.random(),
                    code: 'firstWarning',
                    status: 'ignore',
                  },
                  {
                    validation_id: Math.random(),
                    code: 'secondWarning',
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
    <App dexieInstance={dexieInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexieInstance,
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

  userEvent.click(
    await within(siteRow).findByRole('button', {
      name: 'Reset validations',
    }),
  )

  const isFormDirtyAfterIgnore = await screen.findByRole('button', { name: 'Save' })

  expect(isFormDirtyAfterIgnore)

  await waitFor(() => expect(within(siteRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(siteRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(siteRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(managementRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(managementRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(managementRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(managementRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(depthRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(depthRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(depthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(depthRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(sampleDateRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(sampleDateRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sampleDateRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleDateRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(sampleTimeRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(sampleTimeRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sampleTimeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sampleTimeRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(transectNumberRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(transectNumberRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(transectNumberRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(transectNumberRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(labelRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(labelRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(labelRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(labelRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(lengthSurveyedRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(lengthSurveyedRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(lengthSurveyedRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(lengthSurveyedRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(widthRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(widthRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(widthRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(widthRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(sizeBinRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(sizeBinRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(sizeBinRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(sizeBinRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(reefSlopeRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(reefSlopeRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(reefSlopeRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(reefSlopeRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(notesRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() => expect(within(notesRow).queryByText('firstWarning')).not.toBeInTheDocument())
  expect(within(notesRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(notesRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()

  userEvent.click(
    within(observersRow).getByRole('button', {
      name: 'Reset validations',
    }),
  )

  await waitFor(() =>
    expect(within(observersRow).queryByText('firstWarning')).not.toBeInTheDocument(),
  )
  expect(within(observersRow).queryByText('secondWarning')).not.toBeInTheDocument()
  expect(within(observersRow).queryByLabelText('Passed validation')).not.toBeInTheDocument()
})

// test(
//   'Validation: user edits input with ignored validation dismissed the ignored status for that input.',
// )
