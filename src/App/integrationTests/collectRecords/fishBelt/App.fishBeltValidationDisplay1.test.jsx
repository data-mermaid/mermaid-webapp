import '@testing-library/jest-dom'
import React from 'react'

import { rest } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  within,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockFishbeltValidationsObject from '../../../../testUtilities/mockFishbeltValidationsObject'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Fishbelt validations will show the all warnings when there are multiple warnings and no errors', async () => {
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
                    code: `observation validation with ok status shouldn't show`,
                    status: 'ok',
                    validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
                    context: { observation_id: '7' },
                  },
                  {
                    code: 'observation warning 1',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
                    context: { observation_id: '7' },
                  },
                  {
                    code: 'observation warning 2',
                    status: 'warning',
                    validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
                    context: { observation_id: '7' },
                  },
                ],
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
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(
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
  await waitFor(() =>
    expect(
      screen.getByRole('button', {
        name: 'Validate',
      }),
    ),
  )
  // regular inputs
  expect(within(screen.getByTestId('site')).getByText('firstWarning')).toBeInTheDocument()
  expect(within(screen.getByTestId('site')).getByText('secondWarning')).toBeInTheDocument()

  const observationsTable = screen.getByLabelText('Observations')

  expect(within(observationsTable).getByText('observation warning 1')).toBeInTheDocument()
  expect(within(observationsTable).getByText('observation warning 2')).toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 1')).not.toBeInTheDocument()
  expect(within(observationsTable).queryByText('observation error 2')).not.toBeInTheDocument()
  expect(
    within(observationsTable).queryByText(`observation validation with ok status shouldn't show`),
  ).not.toBeInTheDocument()
}, 50000)

test('Validating an empty collect record, and then editing an input with errors shows the errors until the save button is pressed. Validations show when the validation button is clicked again.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

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

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(
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
  await waitFor(() =>
    expect(
      screen.getByRole('button', {
        name: 'Validate',
      }),
    ),
  )

  expect(within(screen.getByTestId('depth')).getByText('Required')).toBeInTheDocument()

  await user.type(screen.getByLabelText('Depth'), '1')

  // validations remain showing, except Depth is changed
  expect(await within(screen.getByTestId('site')).findByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('management')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample_date')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_time')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('transect_number')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('label')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('len_surveyed')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('width')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('size_bin')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('reef_slope')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).getByText('Required')).toBeInTheDocument()
  expect(
    within(screen.getByLabelText('Observations')).getByText('observation error'),
  ).toBeInTheDocument()

  await user.type(screen.getByLabelText('Depth'), '{backspace}')

  await user.click(
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
  expect(within(screen.getByTestId('site')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('management')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample_date')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample_time')).queryByText('Required')).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('transect_number')).queryByText('Required'),
  ).not.toBeInTheDocument()
  expect(within(screen.getByTestId('label')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('len_surveyed')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('width')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('size_bin')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('reef_slope')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).queryByText('Required')).not.toBeInTheDocument()
  expect(
    within(screen.getByLabelText('Observations')).queryByText('observation error'),
  ).not.toBeInTheDocument()

  await user.click(
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
  await waitFor(() =>
    expect(
      screen.getByRole('button', {
        name: 'Validate',
      }),
    ),
  )

  // validations show again
  expect(within(screen.getByTestId('site')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('management')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_date')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample_time')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('transect_number')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('label')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('len_surveyed')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('width')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('size_bin')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('reef_slope')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).getByText('Required')).toBeInTheDocument()
  expect(
    within(screen.getByLabelText('Observations')).getByText('observation error'),
  ).toBeInTheDocument()
}, 60000)

test('Fishbelt validations will show passed input validations', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

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

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/1'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(
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
  await waitFor(() =>
    expect(
      screen.getByRole('button', {
        name: 'Validate',
      }),
    ),
  )

  // regular inputs

  expect(within(screen.getByTestId('site')).getByLabelText('Passed Validation')).toBeInTheDocument()

  // observations table (has three empty observation)
  expect(
    within(screen.getByLabelText('Observations')).getAllByLabelText('Passed Validation').length,
  ).toEqual(3)
}, 50000)
