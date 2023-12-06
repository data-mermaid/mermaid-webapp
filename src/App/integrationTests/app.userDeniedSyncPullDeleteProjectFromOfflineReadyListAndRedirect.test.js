import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
  mockMermaidApiAllSuccessful,
  waitForElementToBeRemoved,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../App'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test(`When a sync pull responds with sync errors for 403 (user denied pulling data), 
the app will delete the project from the offline-ready projects list and redirect to
a page that informs the user that they dont have permisison for a project`, async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
      initialEntries: ['/projects/5/collecting/'],
    },
  )

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const isProject5OfflineReadyBeforePullNested403 =
    !!(await dexiePerUserDataInstance.uiState_offlineReadyProjects.get('5'))

  expect(isProject5OfflineReadyBeforePullNested403).toBeTruthy()

  // after we have the page loaded,
  // we set up the mock API to have sync errors,
  // then we navigate the user to trigger a sync

  const _mockedApiWithNestedSyncErrorsInPullRequest = mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const responseWithSyncErrors = {
        choices: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        fish_species: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        fish_genera: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        fish_families: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        benthic_attributes: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        collect_records: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        project_managements: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        project_profiles: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
        project_sites: {
          last_revision_num: 'server',
          error: {
            code: 403,
            record_ids: [],
          },
        },
      }

      return res.once(ctx.json(responseWithSyncErrors))
    }),
  )

  // click another project-related page to trigger a sync and use the mock api with sync errors
  const sitesSideNavLink = screen.getByRole('link', { name: 'Sites' })

  await user.click(sitesSideNavLink)

  expect(
    await screen.findByText('You do not have permission to access this project.'),
  ).toBeInTheDocument()
  expect(
    await screen.findByText('The admin of Project V can add you to this project.'),
  ).toBeInTheDocument()

  await waitFor(async () =>
    expect(!!(await dexiePerUserDataInstance.uiState_offlineReadyProjects.get('5'))).toBeFalsy(),
  )
})
