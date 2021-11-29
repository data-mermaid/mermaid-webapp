import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import mockFishbeltValidationsObject from '../../../testUtilities/mockFishbeltValidationsObject'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Validating an empty collect record shows validations (proof of wire-up)', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: mockFishbeltValidationsObject,
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

  userEvent.click(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  expect(
    await screen.findByRole('button', {
      name: 'Validating',
    }),
  )
  expect(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )
  // record level validations
  expect(screen.getByText('record level error 1')).toBeInTheDocument()
  expect(screen.getByText('record level error 2')).toBeInTheDocument()
  expect(screen.getByText('record level warning 1')).toBeInTheDocument()
  expect(screen.getByText('record level warning 2')).toBeInTheDocument()
  expect(screen.queryByText('OK validation shouldnt show')).not.toBeInTheDocument()

  // input level validations

  expect(within(screen.getByTestId('site')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('management')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_date')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_time')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('transect_number')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('label')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('len_surveyed')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('width')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('size_bin')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('reef_slope')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).getByText('required')).toBeInTheDocument()

  // observations table (has one empty observation)

  const observationsTable = screen.getByLabelText('Observations')

  expect(within(observationsTable).getByText('observation error')).toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation warning')).not.toBeInTheDocument()
  expect(
    within(observationsTable).queryByText('observation validation with ok status shoulnt show'),
  ).not.toBeInTheDocument()
})

test('Fishbelt validations will show only the first error when there are multiple errors and warnings', async () => {
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
              obs_belt_fishes: [
                [
                  {
                    name: 'observation validation with ok status shoulnt show',
                    status: 'ok',
                    validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
                  },
                  {
                    name: 'observation error 1',
                    status: 'error',
                    validation_id: '2b289dc99c02e9ae1c764e8a71cca3cc',
                  },
                  {
                    name: 'observation warning 1',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    name: 'observation error 2',
                    status: 'error',
                    validation_id: '2b289dc99c02e9ae1c764e8a71cca3c8',
                  },
                  {
                    name: 'observation warning 2',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                ],
              ],
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    name: 'firstError',
                    status: 'error',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondError',
                    status: 'error',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'warning',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
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

  userEvent.click(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  expect(
    await screen.findByRole('button', {
      name: 'Validating',
    }),
  )
  expect(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  // regular imputs

  expect(within(screen.getByTestId('site')).getByText('firstError')).toBeInTheDocument()
  expect(within(screen.getByTestId('site')).queryByText('secondError')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('site')).queryByText('firstWarning')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('site')).queryByText('secondWarning')).not.toBeInTheDocument()

  // observations table (has one empty observation)

  const observationsTable = screen.getByLabelText('Observations')

  expect(within(observationsTable).getByText('observation error 1')).toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 2')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation warning 1')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation warning 2')).not.toBeInTheDocument()
  expect(
    within(observationsTable).queryByText('observation validation with ok status shoulnt show'),
  ).not.toBeInTheDocument()
})

test('Fishbelt validations will show the all warnings when there are multiple warnings and no errors', async () => {
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
              obs_belt_fishes: [
                [
                  {
                    name: 'observation validation with ok status shoulnt show',
                    status: 'ok',
                    validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
                  },
                  {
                    name: 'observation warning 1',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                  },
                  {
                    name: 'observation warning 2',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                  },
                ],
              ],
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    name: 'firstWarning',
                    status: 'warning',
                  },
                  {
                    validation_id: Math.random(),
                    name: 'secondWarning',
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

  userEvent.click(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  expect(
    await screen.findByRole('button', {
      name: 'Validating',
    }),
  )
  expect(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )
  // regular inputs
  expect(within(screen.getByTestId('site')).queryByText('firstWarning')).toBeInTheDocument()
  expect(within(screen.getByTestId('site')).queryByText('secondWarning')).toBeInTheDocument()

  // observations table (has one empty observation)

  const observationsTable = screen.getByLabelText('Observations')

  expect(within(observationsTable).getByText('observation warning 1')).toBeInTheDocument()
  expect(within(observationsTable).getByText('observation warning 2')).toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 1')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 2')).not.toBeInTheDocument()
  expect(
    within(observationsTable).queryByText('observation validation with ok status shoulnt show'),
  ).not.toBeInTheDocument()
})
test('Validating an empty collect record, and then editing an input with errors shows the errors until the save button is pressed. Validations show when the validation button is clicked again.', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: mockFishbeltValidationsObject,
      }

      const response = {
        benthic_attributes: {
          updates: mockMermaidData.benthic_attributes,
        },
        choices: {
          updates: mockMermaidData.choices,
        },
        collect_records: {
          updates: [collectRecordWithValidation],
        },
        fish_families: {
          updates: mockMermaidData.fish_families,
        },
        fish_genera: {
          updates: mockMermaidData.fish_genera,
        },
        fish_species: {
          updates: mockMermaidData.fish_species,
        },
        project_managements: {
          updates: mockMermaidData.project_managements,
        },
        project_profiles: {
          updates: mockMermaidData.project_profiles,
        },
        project_sites: {
          updates: mockMermaidData.project_sites,
        },
        projects: {
          updates: mockMermaidData.projects,
        },
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

  userEvent.click(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  expect(
    await screen.findByRole('button', {
      name: 'Validating',
    }),
  )
  expect(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  expect(within(screen.getByTestId('depth')).getByText('required')).toBeInTheDocument()

  userEvent.type(screen.getByLabelText('Depth'), '1')

  // validations remain showing
  expect(await within(screen.getByTestId('site')).findByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('management')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_date')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_time')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('transect_number')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('label')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('len_surveyed')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('width')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('size_bin')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('reef_slope')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).getByText('required')).toBeInTheDocument()
  expect(
    within(screen.getByLabelText('Observations')).getByText('observation error'),
  ).toBeInTheDocument()

  userEvent.type(screen.getByLabelText('Depth'), '{backspace}')

  userEvent.click(
    await screen.findByRole('button', {
      name: 'Save',
    }),
  )
  expect(
    await screen.findByRole('button', {
      name: 'Saving',
    }),
  )
  expect(
    await screen.findByRole('button', {
      name: 'Saved',
    }),
  )

  // validations hide
  expect(within(screen.getByTestId('site')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('management')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample_date')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample_time')).queryByText('required')).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('transect_number')).queryByText('required'),
  ).not.toBeInTheDocument()
  expect(within(screen.getByTestId('label')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('len_surveyed')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('width')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('size_bin')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('reef_slope')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).queryByText('required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).queryByText('required')).not.toBeInTheDocument()
  expect(
    within(screen.getByLabelText('Observations')).queryByText('observation error'),
  ).not.toBeInTheDocument()

  userEvent.click(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  expect(
    await screen.findByRole('button', {
      name: 'Validating',
    }),
  )
  expect(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  // validations show again
  expect(within(screen.getByTestId('site')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('management')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_date')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_time')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('transect_number')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('label')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('len_surveyed')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('width')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('size_bin')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('reef_slope')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).getByText('required')).toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).getByText('required')).toBeInTheDocument()
  expect(
    within(screen.getByLabelText('Observations')).getByText('observation error'),
  ).toBeInTheDocument()
}, 35000)

test('Fishbelt validations will show passed input validations', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: {},
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

  userEvent.click(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  expect(
    await screen.findByRole('button', {
      name: 'Validating',
    }),
  )
  expect(
    await screen.findByRole(
      'button',
      {
        name: 'Validate',
      },
      { timeout: 10000 },
    ),
  )

  // regular imputs

  expect(within(screen.getByTestId('site')).getByLabelText('Passed validation')).toBeInTheDocument()

  // observations table (has one empty observation)
  expect(
    within(screen.getByLabelText('Observations')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
})
