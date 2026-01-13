import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

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

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test(`When a sync pull responds with sync errors for 403 (user denied pulling data), 
the app will reset the last revision numbers for collect records, project sites, project managements,
and project profiles to ensure the user can pull fresh data if they are given permission again`, async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  // Create initial revision records that would normally be created during first sync
  const initialRevisionRecords = [
    { dataType: 'benthic_attributes', projectId: 'n/a', lastRevisionNumber: 'initial' },
    { dataType: 'choices', projectId: 'n/a', lastRevisionNumber: 'initial' },
    { dataType: 'fish_families', projectId: 'n/a', lastRevisionNumber: 'initial' },
    { dataType: 'fish_genera', projectId: 'n/a', lastRevisionNumber: 'initial' },
    { dataType: 'fish_species', projectId: 'n/a', lastRevisionNumber: 'initial' },
    { dataType: 'collect_records', projectId: '1', lastRevisionNumber: 'initial' },
    { dataType: 'project_managements', projectId: '1', lastRevisionNumber: 'initial' },
    { dataType: 'project_profiles', projectId: '1', lastRevisionNumber: 'initial' },
    { dataType: 'project_sites', projectId: '1', lastRevisionNumber: 'initial' },
  ]

  await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled.bulkAdd(initialRevisionRecords)

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  expect(screen.getByTestId('projects-link')).toBeInTheDocument()

  const lastRevisionProject1BenthicAttributesBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'benthic_attributes' })
      .toArray()
  const lastRevisionProject1ChoicesBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'choices' })
      .toArray()
  const lastRevisionProject1FishFamiliesBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'fish_families' })
      .toArray()
  const lastRevisionProject1FishGeneraBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'fish_genera' })
      .toArray()
  const lastRevisionProject1FishSpeciesBeforeSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'fish_species' })
      .toArray()
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

  expect(lastRevisionProject1BenthicAttributesBeforeSyncError[0].lastRevisionNumber).toEqual(
    'initial',
  )
  expect(lastRevisionProject1ChoicesBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1FishFamiliesBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1FishGeneraBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1FishSpeciesBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1CollectRecordsBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1ManagementsBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1ProfilesBeforeSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1SitesBeforeSyncError[0].lastRevisionNumber).toEqual('initial')

  // after we have the page loaded,
  // we set up the mock API to have sync errors,
  // then we navigate the user to trigger a sync

  const _mockApiWithFakeServerGeneratedLastRevisionNumbers = mockMermaidApiAllSuccessful.use(
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

  const projectCards = await screen.findAllByTestId('project-card')
  const projectCardForProjectWithId1 = projectCards[0]
  const linkToCollectingPageForProjectWithId1 = within(projectCardForProjectWithId1).getByRole(
    'link',
    { name: 'Collect' },
  )

  await user.click(linkToCollectingPageForProjectWithId1)

  await screen.findByTestId('loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const lastRevisionProject1BenthicAttributesAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'benthic_attributes' })
      .toArray()

  const lastRevisionProject1ChoicesAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'choices' })
      .toArray()
  const lastRevisionProject1FishFamiliesAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'fish_families' })
      .toArray()
  const lastRevisionProject1FishGeneraAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'fish_genera' })
      .toArray()
  const lastRevisionProject1FishSpeciesAfterSyncError =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where({ dataType: 'fish_species' })
      .toArray()

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

  // when a user is denied a sync pull, we want to not mess with the last revision numbers for untouched 'tables'
  expect(lastRevisionProject1BenthicAttributesAfterSyncError[0].lastRevisionNumber).toEqual(
    'server',
  )
  expect(lastRevisionProject1ChoicesAfterSyncError[0].lastRevisionNumber).toEqual('server')
  expect(lastRevisionProject1FishFamiliesAfterSyncError[0].lastRevisionNumber).toEqual('server')
  expect(lastRevisionProject1FishGeneraAfterSyncError[0].lastRevisionNumber).toEqual('server')
  expect(lastRevisionProject1FishSpeciesAfterSyncError[0].lastRevisionNumber).toEqual('server')

  // The 'tables' with project info that has been deleted for a project, need to have nulled out last revision numbers for that table+project combo
  expect(lastRevisionProject1CollectRecordsAfterSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1ManagementsAfterSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1ProfilesAfterSyncError[0].lastRevisionNumber).toEqual('initial')
  expect(lastRevisionProject1SitesAfterSyncError[0].lastRevisionNumber).toEqual('initial')
})
