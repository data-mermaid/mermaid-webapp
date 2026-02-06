import { expect, test } from "vitest";
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import {
  getLastRevisionNumbersPulledForAProject,
  persistLastRevisionNumbersPulled,
  resetLastRevisionNumberForProjectDataType,
} from './lastRevisionNumbers'
import mockMermaidData from '../../testUtilities/mockMermaidData'

test('Make sure last revision numbers are stored per project where appropriate, and project-agnostic entities get the most recent last revision number', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiDataForProjectA = {
    benthic_attributes: { updates: mockMermaidData.benthic_attributes, last_revision_num: 'pull1' },
    choices: { updates: mockMermaidData.choices, last_revision_num: 'pull1' },
    collect_records: { updates: mockMermaidData.collect_records, last_revision_num: 'pull1' },
    fish_families: { updates: mockMermaidData.fish_families, last_revision_num: 'pull1' },
    fish_genera: { updates: mockMermaidData.fish_genera, last_revision_num: 'pull1' },
    fish_species: { updates: mockMermaidData.fish_species, last_revision_num: 'pull1' },
    project_managements: {
      updates: mockMermaidData.project_managements,
      last_revision_num: 'pull1',
    },
    project_profiles: { updates: mockMermaidData.project_profiles, last_revision_num: 'pull1' },
    project_sites: { updates: mockMermaidData.project_sites, last_revision_num: 'pull1' },
    projects: { updates: mockMermaidData.projects, last_revision_num: 'pull1' },
  }

  const apiDataForProjectB = {
    benthic_attributes: { updates: mockMermaidData.benthic_attributes, last_revision_num: 'pull2' },
    choices: { updates: mockMermaidData.choices, last_revision_num: 'pull2' },
    collect_records: { updates: mockMermaidData.collect_records, last_revision_num: 'pull2' },
    fish_families: { updates: mockMermaidData.fish_families, last_revision_num: 'pull2' },
    fish_genera: { updates: mockMermaidData.fish_genera, last_revision_num: 'pull2' },
    fish_species: { updates: mockMermaidData.fish_species, last_revision_num: 'pull2' },
    project_managements: {
      updates: mockMermaidData.project_managements,
      last_revision_num: 'pull2',
    },
    project_profiles: { updates: mockMermaidData.project_profiles, last_revision_num: 'pull2' },
    project_sites: { updates: mockMermaidData.project_sites, last_revision_num: 'pull2' },
    projects: { updates: mockMermaidData.projects, last_revision_num: 'pull2' },
  }

  await persistLastRevisionNumbersPulled({
    dexiePerUserDataInstance,
    apiData: apiDataForProjectA,
    projectId: 'A',
  })

  await persistLastRevisionNumbersPulled({
    dexiePerUserDataInstance,
    apiData: apiDataForProjectB,
    projectId: 'B',
  })
  const lastRevisonNumbersForProjectA = await getLastRevisionNumbersPulledForAProject({
    dexiePerUserDataInstance,
    projectId: 'A',
  })

  const lastRevisonNumbersForProjectB = await getLastRevisionNumbersPulledForAProject({
    dexiePerUserDataInstance,
    projectId: 'B',
  })

  // project-specific entities should have separate last revision nums stored
  expect(lastRevisonNumbersForProjectA.collect_records).toEqual('pull1')
  expect(lastRevisonNumbersForProjectB.collect_records).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.project_managements).toEqual('pull1')
  expect(lastRevisonNumbersForProjectB.project_managements).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.project_profiles).toEqual('pull1')
  expect(lastRevisonNumbersForProjectB.project_profiles).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.project_sites).toEqual('pull1')
  expect(lastRevisonNumbersForProjectB.project_sites).toEqual('pull2')

  // non-project-specific entities should just have the most recent
  // last revision number returned regardless of project parameter supplied
  expect(lastRevisonNumbersForProjectA.benthic_attributes).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.choices).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.fish_families).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.fish_genera).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.fish_species).toEqual('pull2')
  expect(lastRevisonNumbersForProjectA.projects).toEqual('pull2')

  expect(lastRevisonNumbersForProjectB.benthic_attributes).toEqual('pull2')
  expect(lastRevisonNumbersForProjectB.choices).toEqual('pull2')
  expect(lastRevisonNumbersForProjectB.fish_families).toEqual('pull2')
  expect(lastRevisonNumbersForProjectB.fish_genera).toEqual('pull2')
  expect(lastRevisonNumbersForProjectB.fish_species).toEqual('pull2')
  expect(lastRevisonNumbersForProjectB.projects).toEqual('pull2')
})

test("resetLastRevisionNumberForProjectDataType will replace last revision numbers for a project's data type with null", async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiDataForProjectA = {
    benthic_attributes: { updates: mockMermaidData.benthic_attributes, last_revision_num: 'pull1' },
    choices: { updates: mockMermaidData.choices, last_revision_num: 'pull1' },
    collect_records: { updates: mockMermaidData.collect_records, last_revision_num: 'pull1' },
    fish_families: { updates: mockMermaidData.fish_families, last_revision_num: 'pull1' },
    fish_genera: { updates: mockMermaidData.fish_genera, last_revision_num: 'pull1' },
    fish_species: { updates: mockMermaidData.fish_species, last_revision_num: 'pull1' },
    project_managements: {
      updates: mockMermaidData.project_managements,
      last_revision_num: 'pull1',
    },
    project_profiles: { updates: mockMermaidData.project_profiles, last_revision_num: 'pull1' },
    project_sites: { updates: mockMermaidData.project_sites, last_revision_num: 'pull1' },
    projects: { updates: mockMermaidData.projects, last_revision_num: 'pull1' },
  }

  await persistLastRevisionNumbersPulled({
    dexiePerUserDataInstance,
    apiData: apiDataForProjectA,
    projectId: 'A',
  })

  const lastRevisonNumbersForProjectA = await getLastRevisionNumbersPulledForAProject({
    dexiePerUserDataInstance,
    projectId: 'A',
  })

  expect(lastRevisonNumbersForProjectA.collect_records).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.project_managements).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.project_profiles).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.project_sites).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.benthic_attributes).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.choices).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.fish_families).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.fish_genera).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.fish_species).toEqual('pull1')
  expect(lastRevisonNumbersForProjectA.projects).toEqual('pull1')

  await resetLastRevisionNumberForProjectDataType({
    dataType: 'collect_records',
    projectId: 'A',
    dexiePerUserDataInstance,
  })

  await resetLastRevisionNumberForProjectDataType({
    dataType: 'project_managements',
    projectId: 'A',
    dexiePerUserDataInstance,
  })

  await resetLastRevisionNumberForProjectDataType({
    dataType: 'project_profiles',
    projectId: 'A',
    dexiePerUserDataInstance,
  })

  await resetLastRevisionNumberForProjectDataType({
    dataType: 'project_sites',
    projectId: 'A',
    dexiePerUserDataInstance,
  })

  const lastRevisonNumbersAfterResetForProjectA = await getLastRevisionNumbersPulledForAProject({
    dexiePerUserDataInstance,
    projectId: 'A',
  })

  expect(lastRevisonNumbersAfterResetForProjectA.collect_records).toBeNull()
  expect(lastRevisonNumbersAfterResetForProjectA.project_managements).toBeNull()
  expect(lastRevisonNumbersAfterResetForProjectA.project_profiles).toBeNull()
  expect(lastRevisonNumbersAfterResetForProjectA.project_sites).toBeNull()

  // non-project-specific entities should remain untouched
  expect(lastRevisonNumbersAfterResetForProjectA.benthic_attributes).toEqual('pull1')
  expect(lastRevisonNumbersAfterResetForProjectA.choices).toEqual('pull1')
  expect(lastRevisonNumbersAfterResetForProjectA.fish_families).toEqual('pull1')
  expect(lastRevisonNumbersAfterResetForProjectA.fish_genera).toEqual('pull1')
  expect(lastRevisonNumbersAfterResetForProjectA.fish_species).toEqual('pull1')
  expect(lastRevisonNumbersAfterResetForProjectA.projects).toEqual('pull1')
})
