import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import userEvent from '@testing-library/user-event'

import {
  screen,
  renderAuthenticatedOnline,
  mockMermaidApiAllSuccessful,
  within,
  waitForElementToBeRemoved,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../App'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('When a sync pull responds with sync errors for 403 (user denied pulling data), the app will reset the last revision numbers for the data type and project to ensure the user can pull fresh data if they are given permission again', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByText('Projects', { selector: 'h1' }))
  const lastRevisionProject1CollectRecordsBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'collect_records', projectId: '1' })
      .toArray()

  const lastRevisionProject1ManagementsBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'project_managements', projectId: '1' })
      .toArray()

  const lastRevisionProject1ProfilesBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'project_profiles', projectId: '1' })
      .toArray()

  const lastRevisionProject1SitesBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'project_sites', projectId: '1' })
      .toArray()

  expect(lastRevisionProject1CollectRecordsBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1ManagementsBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1ProfilesBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1SitesBeforeSyncError[0].lastRevisionNumber).toEqual('initial')

  // after we have the page loaded,
  // we set up the mock API to have sync errors,
  // then we navigate the user to trigger a sync

  mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const responseWithSyncErrors = {
        benthic_attributes: {
          error: {
            code: 403,
            record_ids: [],
          },
        },
        collect_records: {
          error: {
            code: 403,
            record_ids: [],
          },
        },
        project_managements: {
          error: {
            code: 403,
            record_ids: [],
          },
        },
        project_profiles: {
          error: {
            code: 403,
            record_ids: [],
          },
        },
        project_sites: {
          error: {
            code: 403,
            record_ids: [],
          },
        },
      }

      return res.once(ctx.json(responseWithSyncErrors))
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]
  const projectCardCollectingLink = within(projectCard).getByRole('link', { name: 'Collect' })

  userEvent.click(projectCardCollectingLink)

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const lastRevisionProject1CollectRecordsAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'collect_records', projectId: '1' })
      .toArray()

  const lastRevisionProject1ManagementsAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'project_managements', projectId: '1' })
      .toArray()

  const lastRevisionProject1ProfilesAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'project_profiles', projectId: '1' })
      .toArray()

  const lastRevisionProject1SitesAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'project_sites', projectId: '1' })
      .toArray()

  expect(lastRevisionProject1CollectRecordsAfterSyncError[0].lastRevisionNumber).toBeNull()
  expect(lastRevisionProject1ManagementsAfterSyncError[0].lastRevisionNumber).toBeNull()
  expect(lastRevisionProject1ProfilesAfterSyncError[0].lastRevisionNumber).toBeNull()
  expect(lastRevisionProject1SitesAfterSyncError[0].lastRevisionNumber).toBeNull()
})
