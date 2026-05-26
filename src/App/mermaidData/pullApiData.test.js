import { expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import { getFakeAccessToken } from '../../testUtilities/getFakeAccessToken'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import mockMermaidApiAllSuccessful from '../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import { pullApiData } from './pullApiData'

const allTheDataNames = [
  'benthic_attributes',
  'invert_attributes',
  'choices',
  'collect_records',
  'fish_families',
  'fish_genera',
  'fish_species',
  'project_managements',
  'project_profiles',
  'project_sites',
  'projects',
]
const apiBaseUrl = import.meta.env.VITE_MERMAID_API
const projectId = '5'

test('pullApiData strips uiState_pushToApi properties from api response', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        const response = {
          benthic_attributes: {
            updates: [
              {
                ...mockMermaidData.benthic_attributes[0],
                status: 90,
                uiState_pushToApi: true,
              },
            ],
          },
          invert_attributes: {
            updates: [
              {
                ...mockMermaidData.invert_attributes[0],
                status: 90,
                uiState_pushToApi: true,
              },
            ],
          },
          // choices is weird
          choices: {
            updates: { ...mockMermaidData.choices[0], uiState_pushToApi: true },
          },
          collect_records: {
            updates: [{ ...mockMermaidData.collect_records[0], uiState_pushToApi: true }],
          },
          fish_families: {
            updates: [{ ...mockMermaidData.fish_families[0], uiState_pushToApi: true }],
          },
          fish_genera: {
            updates: [{ ...mockMermaidData.fish_genera[0], uiState_pushToApi: true }],
          },
          fish_species: {
            updates: [{ ...mockMermaidData.fish_species[0], uiState_pushToApi: true }],
          },
          project_managements: {
            updates: [
              {
                ...mockMermaidData.project_managements[0],
                uiState_pushToApi: true,
              },
            ],
          },
          project_profiles: {
            updates: [{ ...mockMermaidData.project_profiles[0], uiState_pushToApi: true }],
          },
          project_sites: {
            updates: [{ ...mockMermaidData.project_sites[0], uiState_pushToApi: true }],
          },
          projects: {
            updates: [{ ...mockMermaidData.projects[0], uiState_pushToApi: true }],
          },
        }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
  )

  await pullApiData({
    apiBaseUrl,
    apiDataNamesToPull: allTheDataNames,
    dexiePerUserDataInstance,
    getAccessToken: getFakeAccessToken,
    handleUserDeniedSyncPull: () => {},
    projectId,
  })

  await Promise.all([
    dexiePerUserDataInstance.benthic_attributes.toArray(),
    dexiePerUserDataInstance.invert_attributes.toArray(),
    dexiePerUserDataInstance.choices.toArray(),
    dexiePerUserDataInstance.collect_records.toArray(),
    dexiePerUserDataInstance.fish_families.toArray(),
    dexiePerUserDataInstance.fish_genera.toArray(),
    dexiePerUserDataInstance.fish_species.toArray(),
    dexiePerUserDataInstance.project_managements.toArray(),
    dexiePerUserDataInstance.project_profiles.toArray(),
    dexiePerUserDataInstance.project_sites.toArray(),
    dexiePerUserDataInstance.projects.toArray(),
  ]).then(
    ([
      benthicAttributesStored,
      invertAttributesStored,
      choicesStored,
      collectRecordsStored,
      fishFamiliesStored,
      fishGeneraStored,
      fishSpeciesStored,
      projectManagementsStored,
      projectProfilesStored,
      projectSitesStored,
      projectsStored,
    ]) => {
      expect(benthicAttributesStored[0].uiState_pushToApi).toBeFalsy()
      expect(invertAttributesStored[0].uiState_pushToApi).toBeFalsy()
      // choices is weird
      expect(choicesStored[0].choices.uiState_pushToApi).toBeFalsy()
      expect(collectRecordsStored[0].uiState_pushToApi).toBeFalsy()
      expect(fishFamiliesStored[0].uiState_pushToApi).toBeFalsy()
      expect(fishGeneraStored[0].uiState_pushToApi).toBeFalsy()
      expect(fishSpeciesStored[0].uiState_pushToApi).toBeFalsy()
      expect(projectManagementsStored[0].uiState_pushToApi).toBeFalsy()
      expect(projectProfilesStored[0].uiState_pushToApi).toBeFalsy()
      expect(projectSitesStored[0].uiState_pushToApi).toBeFalsy()
      expect(projectsStored[0].uiState_pushToApi).toBeFalsy()
    },
  )
})

test('pullApiData removes proposed benthic attribute updates when attribute is not in use by any collect records', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
  const benthicAttributeId = mockMermaidData.benthic_attributes[0].id

  await dexiePerUserDataInstance.benthic_attributes.put({
    ...mockMermaidData.benthic_attributes[0],
    status: 90,
  })

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        const response = {
          benthic_attributes: {
            updates: [{ ...mockMermaidData.benthic_attributes[0], status: 10 }],
          },
        }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
  )

  await pullApiData({
    apiBaseUrl,
    apiDataNamesToPull: allTheDataNames,
    dexiePerUserDataInstance,
    getAccessToken: getFakeAccessToken,
    handleUserDeniedSyncPull: () => {},
    projectId,
  })

  const benthicAttribute = await dexiePerUserDataInstance.benthic_attributes.get(benthicAttributeId)
  expect(benthicAttribute).toBeUndefined()
})

test('pullApiData keeps proposed benthic attribute updates when attribute is in use by a collect record', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
  const benthicAttributeId = mockMermaidData.benthic_attributes[0].id

  await dexiePerUserDataInstance.benthic_attributes.put({
    ...mockMermaidData.benthic_attributes[0],
    status: 90,
  })

  await dexiePerUserDataInstance.collect_records.put({
    id: 'collect-record-using-benthic-attribute',
    data: {
      obs_belt_fishes: [],
      obs_benthic_lits: [{ attribute: benthicAttributeId }],
      obs_benthic_pits: [],
      obs_colonies_bleached: [],
      obs_quadrat_benthic_percent: [],
      obs_benthic_photo_quadrats: [],
    },
  })

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        const response = {
          benthic_attributes: {
            updates: [{ ...mockMermaidData.benthic_attributes[0], status: 10 }],
          },
        }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
  )

  await pullApiData({
    apiBaseUrl,
    apiDataNamesToPull: allTheDataNames,
    dexiePerUserDataInstance,
    getAccessToken: getFakeAccessToken,
    handleUserDeniedSyncPull: () => {},
    projectId,
  })

  const benthicAttribute = await dexiePerUserDataInstance.benthic_attributes.get(benthicAttributeId)
  expect(benthicAttribute).toBeTruthy()
  expect(benthicAttribute.status).toBe(10)
})
