import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
  mockMermaidApiAllSuccessful,
  waitForElementToBeRemoved,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../App'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test(`When a sync pull responds with sync errors for 403 (user denied pulling data), 
the app will delete project-related records from collect records,
project managements, project sites, and project profiles`, async () => {
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

  const benthicAttributesBeforeSyncError =
    await dexiePerUserDataInstance.benthic_attributes.toArray()

  const choicesBeforeSyncError = await dexiePerUserDataInstance.choices.toArray()
  const fishFamiliesBeforeSyncError = await dexiePerUserDataInstance.fish_families.toArray()
  const fishGeneraBeforeSyncError = await dexiePerUserDataInstance.fish_genera.toArray()
  const fishSpeciesBeforeSyncError = await dexiePerUserDataInstance.fish_species.toArray()
  const project5CollectRecordsBeforeSyncError = await dexiePerUserDataInstance.collect_records
    .where({ project: '5' })
    .toArray()

  const project5ManagementsBeforeSyncError = await dexiePerUserDataInstance.project_managements
    .where({ project: '5' })
    .toArray()

  const project5ProfilesBeforeSyncError = await dexiePerUserDataInstance.project_profiles
    .where({ project: '5' })
    .toArray()

  const project5SitesBeforeSyncError = await dexiePerUserDataInstance.project_sites
    .where({ project: '5' })
    .toArray()

  expect(benthicAttributesBeforeSyncError.length).toBeGreaterThan(0)

  expect(choicesBeforeSyncError.length).toBeGreaterThan(0)
  expect(fishFamiliesBeforeSyncError.length).toBeGreaterThan(0)
  expect(fishGeneraBeforeSyncError.length).toBeGreaterThan(0)
  expect(fishSpeciesBeforeSyncError.length).toBeGreaterThan(0)
  expect(project5CollectRecordsBeforeSyncError.length).toBeGreaterThan(0)
  expect(project5ManagementsBeforeSyncError.length).toBeGreaterThan(0)
  expect(project5ProfilesBeforeSyncError.length).toBeGreaterThan(0)
  expect(project5SitesBeforeSyncError.length).toBeGreaterThan(0)

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
  const sitesSideNavLink = screen.getByTestId('nav-sites')

  await user.click(sitesSideNavLink)

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const benthicAttributesAfterSyncError =
    await dexiePerUserDataInstance.benthic_attributes.toArray()

  const choicesAfterSyncError = await dexiePerUserDataInstance.choices.toArray()
  const fishFamiliesAfterSyncError = await dexiePerUserDataInstance.fish_families.toArray()
  const fishGeneraAfterSyncError = await dexiePerUserDataInstance.fish_genera.toArray()
  const fishSpeciesAfterSyncError = await dexiePerUserDataInstance.fish_species.toArray()
  const project5CollectRecordsAfterSyncError = await dexiePerUserDataInstance.collect_records
    .where({ project: '5' })
    .toArray()

  const project5ManagementsAfterSyncError = await dexiePerUserDataInstance.project_managements
    .where({ project: '5' })
    .toArray()

  const project5ProfilesAfterSyncError = await dexiePerUserDataInstance.project_profiles
    .where({ project: '5' })
    .toArray()

  const project5SitesAfterSyncError = await dexiePerUserDataInstance.project_sites
    .where({ project: '5' })
    .toArray()

  // user being denied syncing doesnt impact non-project related data
  expect(benthicAttributesAfterSyncError.length).toBeGreaterThan(0)
  expect(choicesAfterSyncError.length).toBeGreaterThan(0)
  expect(fishFamiliesAfterSyncError.length).toBeGreaterThan(0)
  expect(fishGeneraAfterSyncError.length).toBeGreaterThan(0)
  expect(fishSpeciesAfterSyncError.length).toBeGreaterThan(0)

  // but project related data should be removed from 'tables' for the project in question
  expect(project5CollectRecordsAfterSyncError.length).toBeLessThanOrEqual(0)
  expect(project5ManagementsAfterSyncError.length).toBeLessThanOrEqual(0)
  expect(project5ProfilesAfterSyncError.length).toBeLessThanOrEqual(0)
  expect(project5SitesAfterSyncError.length).toBeLessThanOrEqual(0)
})
