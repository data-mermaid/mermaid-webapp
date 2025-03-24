import { rest } from 'msw'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import mockMermaidApiAllSuccessful from '../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../testUtilities/mockMermaidData'
import SyncApiDataIntoOfflineStorage from './SyncApiDataIntoOfflineStorage'
import { getFakeAccessToken } from '../../../testUtilities/getFakeAccessToken'
import { mockUserDoesntHavePushSyncPermissionForProjects } from '../../../testUtilities/mockPushStatusCodes'

test('pushThenPullAllProjectDataExceptChoices keeps track of returned last_revision_nums and sends them with the next response', async () => {
  let hasFirstPullCallHappened = false

  mockMermaidApiAllSuccessful.use(
    rest.post(`${import.meta.env.VITE_MERMAID_API}/pull/`, (req, res, ctx) => {
      const areLastRevisionNumbersNull =
        req.body.benthic_attributes.last_revision === null &&
        req.body.collect_records.last_revision === null &&
        req.body.fish_families.last_revision === null &&
        req.body.fish_genera.last_revision === null &&
        req.body.fish_species.last_revision === null &&
        req.body.project_managements.last_revision === null &&
        req.body.project_profiles.last_revision === null &&
        req.body.project_sites.last_revision === null &&
        req.body.projects.last_revision === null

      if (areLastRevisionNumbersNull === null && !hasFirstPullCallHappened) {
        hasFirstPullCallHappened = true
        const response = {
          collect_records: { updates: [], deletes: [], last_revision_num: 17 },
        }

        return res(ctx.json(response))
      }

      if (areLastRevisionNumbersNull && hasFirstPullCallHappened) {
        // pushThenPullAllProjectDataExceptChoices shouldn't be sending nulls after
        // it has received a response from the server so we want
        // to cause the test to fail here
        return res(ctx.status(400))
      }

      return res(ctx.status(200))
    }),
  )

  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  // initial pull from api with last revision numbers being null
  await apiSync.pushThenPullAllProjectDataExceptChoices('1')

  // second pull from api should have last revision numbers
  await apiSync.pushThenPullAllProjectDataExceptChoices('1')
})

test('pushThenPullAllProjectData keeps track of returned last_revision_nums and sends them with the next response', async () => {
  let hasFirstPullCallHappened = false

  mockMermaidApiAllSuccessful.use(
    rest.post(`${import.meta.env.VITE_MERMAID_API}/pull/`, (req, res, ctx) => {
      const areLastRevisionNumbersNull =
        req.body.benthic_attributes.last_revision === null &&
        req.body.choices.last_revision === null &&
        req.body.collect_records.last_revision === null &&
        req.body.fish_families.last_revision === null &&
        req.body.fish_genera.last_revision === null &&
        req.body.fish_species.last_revision === null &&
        req.body.project_managements.last_revision === null &&
        req.body.project_profiles.last_revision === null &&
        req.body.project_sites.last_revision === null &&
        req.body.projects.last_revision === null

      if (areLastRevisionNumbersNull === null && !hasFirstPullCallHappened) {
        hasFirstPullCallHappened = true
        const response = {
          collect_records: { updates: [], deletes: [], last_revision_num: 17 },
        }

        return res(ctx.json(response))
      }

      if (areLastRevisionNumbersNull && hasFirstPullCallHappened) {
        // pushThenPullEverything shouldn't be sending nulls after
        // it has received a response from the server so we want
        // to cause the test to fail here
        return res(ctx.status(400))
      }

      return res(ctx.status(200))
    }),
  )

  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  // initial pull from api with last revision numbers being null
  await apiSync.pushThenPullAllProjectData('1')

  // second pull from api should have last revision numbers
  await apiSync.pushThenPullAllProjectData('1')
})

test('pushThenPullEverything keeps track of returned last_revision_nums and sends them with the next response', async () => {
  let hasFirstPullCallHappened = false

  mockMermaidApiAllSuccessful.use(
    rest.post(`${import.meta.env.VITE_MERMAID_API}/pull/`, (req, res, ctx) => {
      const areLastRevisionNumbersNull =
        req.body.benthic_attributes.last_revision === null &&
        req.body.choices.last_revision === null &&
        req.body.fish_families.last_revision === null &&
        req.body.fish_genera.last_revision === null &&
        req.body.fish_species.last_revision === null &&
        req.body.projects.last_revision === null

      if (areLastRevisionNumbersNull && !hasFirstPullCallHappened) {
        hasFirstPullCallHappened = true
        const response = {
          choices: { updates: [], deletes: [], last_revision_num: 17 },
        }

        return res(ctx.json(response))
      }

      if (areLastRevisionNumbersNull && hasFirstPullCallHappened) {
        // pushThenPullEverything shouldn't be sending nulls after
        // it has received a response from the server so we want
        // to cause the test to fail here
        return res(ctx.status(400))
      }

      return res(ctx.status(200))
    }),
  )

  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  // initial pull from api with last revision numbers being null
  await apiSync.pushThenPullEverything()

  // second pull from api should have last revision numbers
  await apiSync.pushThenPullEverything()
})

test('pushThenPullAllProjectDataExceptChoices updates IDB with API data', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  const apiDataNamesToPullNonProject = [
    'benthic_attributes',
    'collect_records',
    'fish_families',
    'fish_genera',
    'fish_species',
    'project_managements',
    'project_profiles',
    'project_sites',
    'projects',
  ]

  // add records to IDB that will be updated/deleted with mock api response
  await dexiePerUserDataInstance.transaction(
    'rw',
    dexiePerUserDataInstance.benthic_attributes,
    dexiePerUserDataInstance.choices,
    dexiePerUserDataInstance.collect_records,
    dexiePerUserDataInstance.fish_families,
    dexiePerUserDataInstance.fish_genera,
    dexiePerUserDataInstance.fish_species,
    dexiePerUserDataInstance.project_managements,
    dexiePerUserDataInstance.project_profiles,
    dexiePerUserDataInstance.project_sites,
    dexiePerUserDataInstance.projects,
    () => {
      apiDataNamesToPullNonProject.forEach((apiDataName) => {
        dexiePerUserDataInstance[apiDataName].put({
          ...mockMermaidData[apiDataName][1],
          somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
        })
        dexiePerUserDataInstance[apiDataName].put(mockMermaidData[apiDataName][0])
      })
    },
  )

  mockMermaidApiAllSuccessful.use(
    rest.post(`${import.meta.env.VITE_MERMAID_API}/pull/`, (req, res, ctx) => {
      const response = {
        benthic_attributes: {
          updates: [mockMermaidData.benthic_attributes[1]],
          deletes: [mockMermaidData.benthic_attributes[0]],
          last_revision_num: 17,
        },
        collect_records: {
          updates: [mockMermaidData.collect_records[1]],
          deletes: [mockMermaidData.collect_records[0]],
          last_revision_num: 17,
        },
        fish_families: {
          updates: [mockMermaidData.fish_families[1]],
          deletes: [mockMermaidData.fish_families[0]],
          last_revision_num: 17,
        },
        fish_genera: {
          updates: [mockMermaidData.fish_genera[1]],
          deletes: [mockMermaidData.fish_genera[0]],
          last_revision_num: 17,
        },
        fish_species: {
          updates: [mockMermaidData.fish_species[1]],
          deletes: [mockMermaidData.fish_species[0]],
          last_revision_num: 17,
        },
        project_managements: {
          updates: [mockMermaidData.project_managements[1]],
          deletes: [mockMermaidData.project_managements[0]],
          last_revision_num: 17,
        },
        project_profiles: {
          updates: [mockMermaidData.project_profiles[1]],
          deletes: [mockMermaidData.project_profiles[0]],
          last_revision_num: 17,
        },
        project_sites: {
          updates: [mockMermaidData.project_sites[1]],
          deletes: [mockMermaidData.project_sites[0]],
          last_revision_num: 17,
        },
        projects: {
          updates: [mockMermaidData.projects[1]],
          deletes: [mockMermaidData.projects[0]],
          last_revision_num: 17,
        },
      }

      return res(ctx.json(response))
    }),
  )

  expect.assertions(18)
  await apiSync.pushThenPullAllProjectDataExceptChoices('1').then(async () => {
    await Promise.all([
      dexiePerUserDataInstance.benthic_attributes.toArray(),
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
        collectRecordsStored,
        fishFamiliesStored,
        fishGeneraStored,
        fishSpeciesStored,
        projectManagementsStored,
        projectProfilesStored,
        projectStiesStored,
        projectsStored,
      ]) => {
        expect(
          benthicAttributesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(benthicAttributesStored.length).toEqual(1)
        expect(
          collectRecordsStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(collectRecordsStored.length).toEqual(1)
        expect(
          fishFamiliesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(fishFamiliesStored.length).toEqual(1)
        expect(
          fishGeneraStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(fishGeneraStored.length).toEqual(1)
        expect(
          fishSpeciesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(fishSpeciesStored.length).toEqual(1)
        expect(
          projectManagementsStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(projectManagementsStored.length).toEqual(1)
        expect(
          projectProfilesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(projectProfilesStored.length).toEqual(1)
        expect(
          projectStiesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(projectStiesStored.length).toEqual(1)
        expect(
          projectsStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(projectsStored.length).toEqual(1)
      },
    )
  })
})

test('pushThenPullAllProjectData updates IDB with API data', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  const apiDataNamesToPullNonProject = [
    'benthic_attributes',
    // 'choices', choices is weird. We deal with that individually
    'collect_records',
    'fish_families',
    'fish_genera',
    'fish_species',
    'project_managements',
    'project_profiles',
    'project_sites',
    'projects',
  ]

  // add records to IDB that will be updated/deleted with mock api response
  await dexiePerUserDataInstance.transaction(
    'rw',
    dexiePerUserDataInstance.benthic_attributes,
    dexiePerUserDataInstance.choices,
    dexiePerUserDataInstance.collect_records,
    dexiePerUserDataInstance.fish_families,
    dexiePerUserDataInstance.fish_genera,
    dexiePerUserDataInstance.fish_species,
    dexiePerUserDataInstance.project_managements,
    dexiePerUserDataInstance.project_profiles,
    dexiePerUserDataInstance.project_sites,
    dexiePerUserDataInstance.projects,
    () => {
      apiDataNamesToPullNonProject.forEach((apiDataName) => {
        dexiePerUserDataInstance[apiDataName].put({
          ...mockMermaidData[apiDataName][1],
          somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
        })
        dexiePerUserDataInstance[apiDataName].put(mockMermaidData[apiDataName][0])
      })

      // add choices separately because its weird
      dexiePerUserDataInstance.choices.put({
        id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
        ...mockMermaidData.choices,
        somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
      })
    },
  )

  mockMermaidApiAllSuccessful.use(
    rest.post(`${import.meta.env.VITE_MERMAID_API}/pull/`, (req, res, ctx) => {
      const response = {
        benthic_attributes: {
          updates: [mockMermaidData.benthic_attributes[1]],
          deletes: [mockMermaidData.benthic_attributes[0]],
          last_revision_num: 17,
        },
        // weird choices
        choices: {
          updates: [mockMermaidData.choices[1]],
          deletes: [], // never any deletes
          last_revision_num: -1,
        },
        collect_records: {
          updates: [mockMermaidData.collect_records[1]],
          deletes: [mockMermaidData.collect_records[0]],
          last_revision_num: 17,
        },
        fish_families: {
          updates: [mockMermaidData.fish_families[1]],
          deletes: [mockMermaidData.fish_families[0]],
          last_revision_num: 17,
        },
        fish_genera: {
          updates: [mockMermaidData.fish_genera[1]],
          deletes: [mockMermaidData.fish_genera[0]],
          last_revision_num: 17,
        },
        fish_species: {
          updates: [mockMermaidData.fish_species[1]],
          deletes: [mockMermaidData.fish_species[0]],
          last_revision_num: 17,
        },
        project_managements: {
          updates: [mockMermaidData.project_managements[1]],
          deletes: [mockMermaidData.project_managements[0]],
          last_revision_num: 17,
        },
        project_profiles: {
          updates: [mockMermaidData.project_profiles[1]],
          deletes: [mockMermaidData.project_profiles[0]],
          last_revision_num: 17,
        },
        project_sites: {
          updates: [mockMermaidData.project_sites[1]],
          deletes: [mockMermaidData.project_sites[0]],
          last_revision_num: 17,
        },
        projects: {
          updates: [mockMermaidData.projects[1]],
          deletes: [mockMermaidData.projects[0]],
          last_revision_num: 17,
        },
      }

      return res(ctx.json(response))
    }),
  )

  expect.assertions(20)
  await apiSync.pushThenPullAllProjectData('1').then(async () => {
    await Promise.all([
      dexiePerUserDataInstance.benthic_attributes.toArray(),
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
        choicesStored,
        collectRecordsStored,
        fishFamiliesStored,
        fishGeneraStored,
        fishSpeciesStored,
        projectManagementsStored,
        projectProfilesStored,
        projectStiesStored,
        projectsStored,
      ]) => {
        expect(
          benthicAttributesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(benthicAttributesStored.length).toEqual(1)
        expect(
          choicesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(choicesStored.length).toEqual(1)
        expect(
          collectRecordsStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(collectRecordsStored.length).toEqual(1)
        expect(
          fishFamiliesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(fishFamiliesStored.length).toEqual(1)
        expect(
          fishGeneraStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(fishGeneraStored.length).toEqual(1)
        expect(
          fishSpeciesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(fishSpeciesStored.length).toEqual(1)
        expect(
          projectManagementsStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(projectManagementsStored.length).toEqual(1)
        expect(
          projectProfilesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(projectProfilesStored.length).toEqual(1)
        expect(
          projectStiesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(projectStiesStored.length).toEqual(1)
        expect(
          projectsStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(projectsStored.length).toEqual(1)
      },
    )
  })
})

test('pushThenPullEverything updates IDB with API data', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  // so we can test that an offline ready project gets pulled too
  await dexiePerUserDataInstance.uiState_offlineReadyProjects.put({ id: '5' })

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  const apiDataNamesToPullNonProject = [
    'benthic_attributes',
    // 'choices', choices is weird. We deal with that individually
    'fish_families',
    'fish_genera',
    'fish_species',
    'projects',
  ]

  // add records to IDB that will be updated/deleted with mock api response
  await dexiePerUserDataInstance.transaction(
    'rw',
    dexiePerUserDataInstance.benthic_attributes,
    dexiePerUserDataInstance.choices,
    dexiePerUserDataInstance.fish_families,
    dexiePerUserDataInstance.fish_genera,
    dexiePerUserDataInstance.fish_species,
    dexiePerUserDataInstance.projects,
    () => {
      apiDataNamesToPullNonProject.forEach((apiDataName) => {
        dexiePerUserDataInstance[apiDataName].put({
          ...mockMermaidData[apiDataName][1],
          somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
        })
        dexiePerUserDataInstance[apiDataName].put(mockMermaidData[apiDataName][0])
      })

      // add choices separately because its weird
      dexiePerUserDataInstance.choices.put({
        id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
        ...mockMermaidData.choices,
        somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
      })
    },
  )

  mockMermaidApiAllSuccessful.use(
    rest.post(`${import.meta.env.VITE_MERMAID_API}/pull/`, (req, res, ctx) => {
      const response = {
        benthic_attributes: {
          updates: [mockMermaidData.benthic_attributes[1]],
          deletes: [mockMermaidData.benthic_attributes[0]],
          last_revision_num: 17,
        },
        // weird choices
        choices: {
          updates: [mockMermaidData.choices[1]],
          deletes: [], // never any deletes
          last_revision_num: -1,
        },
        fish_families: {
          updates: [mockMermaidData.fish_families[1]],
          deletes: [mockMermaidData.fish_families[0]],
          last_revision_num: 17,
        },
        fish_genera: {
          updates: [mockMermaidData.fish_genera[1]],
          deletes: [mockMermaidData.fish_genera[0]],
          last_revision_num: 17,
        },
        fish_species: {
          updates: [mockMermaidData.fish_species[1]],
          deletes: [mockMermaidData.fish_species[0]],
          last_revision_num: 17,
        },
        projects: {
          updates: [mockMermaidData.projects[1]],
          deletes: [mockMermaidData.projects[0]],
          last_revision_num: 17,
        },
      }

      const isOfflineReadyProjectsPull = !!req.body.collect_records

      if (isOfflineReadyProjectsPull) {
        response.collect_records = {
          updates: [mockMermaidData.collect_records[1]],
          deletes: [mockMermaidData.collect_records[0]],
          last_revision_num: 17,
        }
        response.project_managements = {
          updates: [mockMermaidData.project_managements[1]],
          deletes: [mockMermaidData.project_managements[0]],
          last_revision_num: 17,
        }
        response.project_profiles = {
          updates: [mockMermaidData.project_profiles[1]],
          deletes: [mockMermaidData.project_profiles[0]],
          last_revision_num: 17,
        }
        response.project_sites = {
          updates: [mockMermaidData.project_sites[1]],
          deletes: [mockMermaidData.project_sites[0]],
          last_revision_num: 17,
        }
      }

      return res(ctx.json(response))
    }),
  )

  expect.assertions(16)
  await apiSync.pushThenPullEverything().then(async () => {
    await Promise.all([
      dexiePerUserDataInstance.benthic_attributes.toArray(),
      dexiePerUserDataInstance.choices.toArray(),
      dexiePerUserDataInstance.fish_families.toArray(),
      dexiePerUserDataInstance.fish_genera.toArray(),
      dexiePerUserDataInstance.fish_species.toArray(),
      dexiePerUserDataInstance.projects.toArray(),
      dexiePerUserDataInstance.collect_records.toArray(),
      dexiePerUserDataInstance.project_managements.toArray(),
      dexiePerUserDataInstance.project_profiles.toArray(),
      dexiePerUserDataInstance.project_sites.toArray(),
    ]).then(
      ([
        benthicAttributesStored,
        choicesStored,
        fishFamiliesStored,
        fishGeneraStored,
        fishSpeciesStored,
        projectsStored,
        collectRecordsStored,
        projectManagementsStored,
        projectProfilesStored,
        projectSitesStored,
      ]) => {
        expect(
          benthicAttributesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        // expect second stored record to get deleted
        expect(benthicAttributesStored.length).toEqual(1)
        expect(
          choicesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(choicesStored.length).toEqual(1)
        expect(
          fishFamiliesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(fishFamiliesStored.length).toEqual(1)
        expect(
          fishGeneraStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(fishGeneraStored.length).toEqual(1)
        expect(
          fishSpeciesStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(fishSpeciesStored.length).toEqual(1)

        expect(
          projectsStored[0].somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
        ).not.toBeDefined()
        expect(projectsStored.length).toEqual(1)
        expect(collectRecordsStored.length).toEqual(1)
        expect(projectManagementsStored.length).toEqual(1)
        expect(projectProfilesStored.length).toEqual(1)
        expect(projectSitesStored.length).toEqual(1)
      },
    )
  })
})
test('pushChanges includes the force flag', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        const force = req.url.searchParams.get('force')

        if (!force) {
          // this causes a test failure if the pushChanges
          // function fails to send the api: force=true

          return res.once(ctx.status(400))
        }

        return res(ctx.status(200))
      },
    ),
  )
  expect.assertions(1)
  const response = await apiSync.pushChanges()

  expect(response).not.toBeUndefined()
})

test('pushChanges includes the expected modified data', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  // add a uiState_pushToApi flag to one of each data type to simulate it being edited/created
  await dexiePerUserDataInstance.benthic_attributes.put({
    ...(await dexiePerUserDataInstance.benthic_attributes.toArray())[0],
    uiState_pushToApi: true,
  })
  await dexiePerUserDataInstance.collect_records.put({
    ...(await dexiePerUserDataInstance.collect_records.toArray())[0],
    uiState_pushToApi: true,
  })
  await dexiePerUserDataInstance.fish_species.put({
    ...(await dexiePerUserDataInstance.fish_species.toArray())[0],
    uiState_pushToApi: true,
  })

  await dexiePerUserDataInstance.project_managements.put({
    ...(await dexiePerUserDataInstance.project_managements.toArray())[0],
    uiState_pushToApi: true,
  })

  await dexiePerUserDataInstance.project_profiles.put({
    ...(await dexiePerUserDataInstance.project_profiles.toArray())[0],
    uiState_pushToApi: true,
  })

  await dexiePerUserDataInstance.project_sites.put({
    ...(await dexiePerUserDataInstance.project_sites.toArray())[0],
    uiState_pushToApi: true,
  })
  await dexiePerUserDataInstance.projects.put({
    ...(await dexiePerUserDataInstance.projects.toArray())[0],
    uiState_pushToApi: true,
  })
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: () => {},
    handleNested500SyncError: () => {},
  })

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        const {
          benthic_attributes,
          collect_records,
          fish_species,
          project_managements,
          project_profiles,
          project_sites,
          projects,
        } = req.body

        if (
          !benthic_attributes.length === 1 ||
          !collect_records.length === 1 ||
          !fish_species.length === 1 ||
          !project_managements.length === 1 ||
          !project_profiles.length === 1 ||
          !project_sites.length === 1 ||
          !projects.length === 1
        ) {
          return res(ctx.status(400))
        }

        return res(ctx.status(200))
      },
    ),
  )
  expect.assertions(1)
  const response = await apiSync.pushChanges()

  expect(response).not.toBeUndefined()
})

test('All of the push functions handle sync errors with the handleUserDeniedSyncPush callback function', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
  const pushSyncErrorCallback = jest.fn()

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        return res(ctx.json(mockUserDoesntHavePushSyncPermissionForProjects))
      },
    ),
  )

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: import.meta.env.VITE_MERMAID_API,
    getAccessToken: getFakeAccessToken,
    dexiePerUserDataInstance,
    handleUserDeniedSyncPull: () => {},
    handleUserDeniedSyncPush: pushSyncErrorCallback,
    handleNested500SyncError: () => {},
  })

  await apiSync.pushChanges()
  await apiSync.pushThenPullAllProjectData('PROJECT ID')
  await apiSync.pushThenPullAllProjectDataExceptChoices('PROJECT ID')
  await apiSync.pushThenPullEverything()
  await apiSync.pushThenPullFishOrBenthicAttributes('fish_species')
  await apiSync.pushThenRemoveProjectFromOfflineStorage('PROJECT ID')

  expect(pushSyncErrorCallback).toHaveBeenCalledTimes(6)
})
