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
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Fishbelt validations show check for valid inputs', async () => {
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
              sample_event: {
                site: [
                  {
                    code: 'firstError',
                    status: 'ok', // site has an explicit pass for validation, the rest have no info, so we interpret that as a pass
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

  expect(within(screen.getByTestId('site')).getByLabelText('Passed validation')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('management')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('depth')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample_date')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('sample_time')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('transect-number')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('label')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('len_surveyed')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('width')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('size_bin')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('reef_slope')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('notes')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
  expect(
    within(screen.getByTestId('observers')).getByLabelText('Passed validation'),
  ).toBeInTheDocument()
})
