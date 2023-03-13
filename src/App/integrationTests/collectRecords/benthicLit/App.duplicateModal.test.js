import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { mockBenthicLitCollectRecords } from '../../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'
import App from '../../../App'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Validate collect record, get site duplicate warning, show resolve button, keep and merge original site', async () => {
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
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    code: 'not_unique_site',
                    status: 'warning',
                    context: { matches: ['4'] },
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
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
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

  expect(
    within(screen.getByTestId('site')).queryByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  userEvent.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByTestId('resolve-duplicate-site')

  const originalSite = await within(resolveModal).findByTestId('original-site')
  const keepOriginalButton = await within(originalSite).findByRole('button', { name: 'Keep site' })

  userEvent.click(keepOriginalButton)

  const confirmationModal = screen.getByTestId('confirm-merge-site')

  expect(
    await within(confirmationModal).findByText(
      'All instances of this site will be replaced with original site',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByRole('button', { name: 'Merge' })

  userEvent.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('resolve-duplicate-site'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText('Site: Similar records detected'),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate collect record, get site duplicate warning, show resolve button, keep and merge duplicate site', async () => {
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
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    code: 'not_unique_site',
                    status: 'warning',
                    context: { matches: ['4'] },
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
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
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

  expect(
    within(screen.getByTestId('site')).queryByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  userEvent.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByTestId('resolve-duplicate-site')

  const duplicateSite = await within(resolveModal).findByTestId('duplicate-site')
  const keepDuplicateButton = await within(duplicateSite).findByRole('button', {
    name: 'Keep site',
  })

  userEvent.click(keepDuplicateButton, { id: '4' })

  const confirmationModal = screen.getByTestId('confirm-merge-site')

  expect(
    await within(confirmationModal).findByText(
      'All instances of this site will be replaced with duplicate site',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByRole('button', { name: 'Merge' })

  userEvent.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('resolve-duplicate-site'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText('Site: Similar records detected'),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate collect record, get site duplicate warning, show resolve button, edit original site', async () => {
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
              sample_event: {
                site: [
                  {
                    validation_id: Math.random(),
                    code: 'not_unique_site',
                    status: 'warning',
                    context: { matches: ['4'] },
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
      initialEntries: ['/projects/5/collecting/benthiclit/70'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
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

  expect(
    within(screen.getByTestId('site')).queryByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  userEvent.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByTestId('resolve-duplicate-site')

  const originalSite = await within(resolveModal).findByTestId('original-site')
  const editOriginalSite = await within(originalSite).findByRole('button', {
    name: 'Edit site',
  })

  userEvent.click(editOriginalSite)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const siteCPage = await screen.findByText('Site C', {
    selector: 'h2',
  })

  expect(siteCPage).toBeInTheDocument()
}, 50000)
