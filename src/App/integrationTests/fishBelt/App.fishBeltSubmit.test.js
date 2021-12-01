import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import userEvent from '@testing-library/user-event'

import { screen, renderAuthenticatedOnline } from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import App from '../../App'
import mockMermaidData from '../../../testUtilities/mockMermaidData'
import mockMermaidApiAllSuccessful from '../../../testUtilities/mockMermaidApiAllSuccessful'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('Submit fishbelt success shows toast message and redirects to collect record list page', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/fishbelt/1'],
    dexieInstance,
  })

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: { status: 'ok' },
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

  userEvent.click(await screen.findByText('Validate', { selector: 'button' }))
  expect(await screen.findByText('Validated', { selector: 'button' }))

  userEvent.click(await screen.findByText('Submit', { selector: 'button' }))

  expect(await screen.findByText('Collect record submitted.'))
  expect(await screen.findByText('Collect Records', { selector: 'h2' }))

  // we dont test that the record is removed from dexie becuase that is the responsibility
  // of sync + the api.Post submit pulls updates and deletes.
})

test('Submit fishbelt failure shows toast message and an enabled submit button', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting/fishbelt/1'],
    dexieInstance,
  })

  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const collectRecordWithValidation = {
        ...mockMermaidData.collect_records[0],
        validations: { status: 'ok' },
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
    rest.post(`${apiBaseUrl}/projects/5/collectrecords/submit/`, (req, res, ctx) => {
      return res(ctx.status(400))
    }),
  )

  userEvent.click(await screen.findByText('Validate', { selector: 'button' }))
  expect(await screen.findByText('Validated', { selector: 'button' })) // just to make act errors silence
  userEvent.click(await screen.findByText('Submit', { selector: 'button' }))
  expect(await screen.findByText('Submitting', { selector: 'button' }))

  expect(
    await screen.findByText('Something went wrong. The collect record has not been submitted.'),
  )
  expect(await screen.findByText('Submit', { selector: 'button' })).toBeEnabled()
  expect(await screen.findByText('Validated', { selector: 'button' })).toBeDisabled()
  expect(await screen.findByText('Saved', { selector: 'button' })).toBeDisabled()
})
