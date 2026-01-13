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
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBleachingCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'
import mockBleachingValidationsObject from '../../../../testUtilities/mockBleachingValidationsObject'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Bleaching collect record validations will show the all warnings when there are multiple warnings and no errors', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const mockGenericObservationValidationsWithWarnings = [
    [
      {
        code: `observation validation with ok status shouldn't show`,
        status: 'ok',
        validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
        context: { observation_id: '1' },
      },
      {
        code: 'observation warning 1',
        status: 'warning',
        validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
        context: { observation_id: '1' },
      },
      {
        code: 'observation warning 2',
        status: 'warning',
        validation_id: 'ccb38683efc25838ec9b7ff026e78a18',
        context: { observation_id: '1' },
      },
    ],
  ]

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
        validations: {
          status: 'error',
          results: {
            data: {
              obs_colonies_bleached: mockGenericObservationValidationsWithWarnings,
              obs_quadrat_benthic_percent: mockGenericObservationValidationsWithWarnings,
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))
  // regular inputs
  expect(within(screen.getByTestId('site')).getByText('firstWarning')).toBeInTheDocument()
  expect(within(screen.getByTestId('site')).getByText('secondWarning')).toBeInTheDocument()

  const coloniesBleachedObservationsTable = screen.getByTestId('observations-section-table')
  const percentCoverObservationsTable = screen.getByTestId('observations2-section-table')

  expect(
    within(coloniesBleachedObservationsTable).getByText('observation warning 1'),
  ).toBeInTheDocument()
  expect(
    within(coloniesBleachedObservationsTable).getByText('observation warning 2'),
  ).toBeInTheDocument()
  expect(
    within(coloniesBleachedObservationsTable).queryByText('observation error 1'),
  ).not.toBeInTheDocument()
  expect(
    within(coloniesBleachedObservationsTable).queryByText('observation error 2'),
  ).not.toBeInTheDocument()
  expect(
    within(coloniesBleachedObservationsTable).queryByText(
      `observation validation with ok status shouldn't show`,
    ),
  ).not.toBeInTheDocument()

  expect(
    within(percentCoverObservationsTable).getByText('observation warning 1'),
  ).toBeInTheDocument()
  expect(
    within(percentCoverObservationsTable).getByText('observation warning 2'),
  ).toBeInTheDocument()
  expect(
    within(percentCoverObservationsTable).queryByText('observation error 1'),
  ).not.toBeInTheDocument()
  expect(
    within(percentCoverObservationsTable).queryByText('observation error 2'),
  ).not.toBeInTheDocument()
  expect(
    within(percentCoverObservationsTable).queryByText(
      `observation validation with ok status shouldn't show`,
    ),
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
        ...mockBleachingCollectRecords[0],
        validations: mockBleachingValidationsObject,
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  expect(await within(screen.getByTestId('depth')).findByText('Required')).toBeInTheDocument()

  await user.type(screen.getByTestId('depth-input'), '1')

  // validations remain showing, except Depth is changed
  expect(await within(screen.getByTestId('site')).findByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('management')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample-date')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample-time')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('quadrat-size')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('label')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).getByText('Required')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-section-table')).getByText('observation error'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations2-section-table')).getByText('observation error'),
  ).toBeInTheDocument()

  await user.type(screen.getByTestId('depth-input'), '{backspace}')

  await user.click(await screen.findByTestId('save-button'))
  expect(await screen.findByTestId('saving-button'))
  expect(await screen.findByTestId('saved-button'))

  // validations hide
  expect(within(screen.getByTestId('site')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('management')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample-date')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('sample-time')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('quadrat-size')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('label')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).queryByText('Required')).not.toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).queryByText('Required')).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-section-table')).queryByText('observation error'),
  ).not.toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations2-section-table')).queryByText('observation error'),
  ).not.toBeInTheDocument()

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  // validations show again
  expect(within(screen.getByTestId('site')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('management')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('depth')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample-date')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('sample-time')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('quadrat-size')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('label')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('notes')).getByText('Required')).toBeInTheDocument()
  expect(within(screen.getByTestId('observers')).getByText('Required')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations-section-table')).getByText('observation error'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observations2-section-table')).getByText('observation error'),
  ).toBeInTheDocument()
}, 60000)

test('Bleaching collect record validations will show passed input validations', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),

    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(await screen.findByTestId('validating-button'))
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  // regular inputs (sample)

  expect(within(screen.getByTestId('site')).getByLabelText('Passed Validation')).toBeInTheDocument()

  // observations table (has three empty observations)
  expect(
    within(screen.getByTestId('observations-section-table')).getAllByLabelText('Passed Validation')
      .length,
  ).toEqual(3)

  expect(
    within(screen.getByTestId('observations2-section-table')).getAllByLabelText('Passed Validation')
      .length,
  ).toEqual(3)
}, 50000)
