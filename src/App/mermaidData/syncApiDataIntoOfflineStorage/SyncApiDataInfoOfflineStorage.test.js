import { rest } from 'msw'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import mockMermaidApiAllSuccessful from '../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../testUtilities/mockMermaidData'
import SyncApiDataIntoOfflineStorage from './SyncApiDataIntoOfflineStorage'

test('pushThenPullEverythingForAProjectButChoices keeps track of returned last_revision_nums and sends them with the next response', async () => {
  let hasFirstPullCallHappened = false

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
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
        // pushThenPullEverythingForAProjectButChoices shouldn't be sending nulls after
        // it has received a response from the server so we want
        // to cause the test to fail here
        return res(ctx.status(400))
      }

      return res(ctx.status(200))
    }),
  )

  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
  })

  // initial pull from api with last revision numbers being null
  await apiSync.pushThenPullEverythingForAProjectButChoices('1')

  // second pull from api should have last revision numbers
  await apiSync.pushThenPullEverythingForAProjectButChoices('1')
})

test('pushThenPullEverythingForAProject keeps track of returned last_revision_nums and sends them with the next response', async () => {
  let hasFirstPullCallHappened = false

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
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

  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
  })

  // initial pull from api with last revision numbers being null
  await apiSync.pushThenPullEverythingForAProject('1')

  // second pull from api should have last revision numbers
  await apiSync.pushThenPullEverythingForAProject('1')
})

test('pushThenPullEverything keeps track of returned last_revision_nums and sends them with the next response', async () => {
  let hasFirstPullCallHappened = false

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
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

  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
  })

  // initial pull from api with last revision numbers being null
  await apiSync.pushThenPullEverything()

  // second pull from api should have last revision numbers
  await apiSync.pushThenPullEverything()
})

test('pushThenPullEverythingForAProjectButChoices updates IDB with API data', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
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
  await dexieInstance.transaction(
    'rw',
    dexieInstance.benthic_attributes,
    dexieInstance.choices,
    dexieInstance.collect_records,
    dexieInstance.fish_families,
    dexieInstance.fish_genera,
    dexieInstance.fish_species,
    dexieInstance.project_managements,
    dexieInstance.project_profiles,
    dexieInstance.project_sites,
    dexieInstance.projects,
    () => {
      apiDataNamesToPullNonProject.forEach(apiDataName => {
        dexieInstance[apiDataName].put({
          ...mockMermaidData[apiDataName][1],
          somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
        })
        dexieInstance[apiDataName].put(mockMermaidData[apiDataName][0])
      })
    },
  )

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
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
  await apiSync.pushThenPullEverythingForAProjectButChoices('1').then(async () => {
    await Promise.all([
      dexieInstance.benthic_attributes.toArray(),
      dexieInstance.collect_records.toArray(),
      dexieInstance.fish_families.toArray(),
      dexieInstance.fish_genera.toArray(),
      dexieInstance.fish_species.toArray(),
      dexieInstance.project_managements.toArray(),
      dexieInstance.project_profiles.toArray(),
      dexieInstance.project_sites.toArray(),
      dexieInstance.projects.toArray(),
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

test('pushThenPullEverythingForAProject updates IDB with API data', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
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
  await dexieInstance.transaction(
    'rw',
    dexieInstance.benthic_attributes,
    dexieInstance.choices,
    dexieInstance.collect_records,
    dexieInstance.fish_families,
    dexieInstance.fish_genera,
    dexieInstance.fish_species,
    dexieInstance.project_managements,
    dexieInstance.project_profiles,
    dexieInstance.project_sites,
    dexieInstance.projects,
    () => {
      apiDataNamesToPullNonProject.forEach(apiDataName => {
        dexieInstance[apiDataName].put({
          ...mockMermaidData[apiDataName][1],
          somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
        })
        dexieInstance[apiDataName].put(mockMermaidData[apiDataName][0])
      })

      // add choices separately because its weird
      dexieInstance.choices.put({
        id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
        ...mockMermaidData.choices,
        somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
      })
    },
  )

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
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
  await apiSync.pushThenPullEverythingForAProject('1').then(async () => {
    await Promise.all([
      dexieInstance.benthic_attributes.toArray(),
      dexieInstance.choices.toArray(),
      dexieInstance.collect_records.toArray(),
      dexieInstance.fish_families.toArray(),
      dexieInstance.fish_genera.toArray(),
      dexieInstance.fish_species.toArray(),
      dexieInstance.project_managements.toArray(),
      dexieInstance.project_profiles.toArray(),
      dexieInstance.project_sites.toArray(),
      dexieInstance.projects.toArray(),
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
  const dexieInstance = getMockDexieInstanceAllSuccess()

  // so we can test that an offline ready project gets pulled too
  await dexieInstance.uiState_offlineReadyProjects.put({ id: '5' })

  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
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
  await dexieInstance.transaction(
    'rw',
    dexieInstance.benthic_attributes,
    dexieInstance.choices,
    dexieInstance.fish_families,
    dexieInstance.fish_genera,
    dexieInstance.fish_species,
    dexieInstance.projects,
    () => {
      apiDataNamesToPullNonProject.forEach(apiDataName => {
        dexieInstance[apiDataName].put({
          ...mockMermaidData[apiDataName][1],
          somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
        })
        dexieInstance[apiDataName].put(mockMermaidData[apiDataName][0])
      })

      // add choices separately because its weird
      dexieInstance.choices.put({
        id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
        ...mockMermaidData.choices,
        somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
      })
    },
  )

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
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
      dexieInstance.benthic_attributes.toArray(),
      dexieInstance.choices.toArray(),
      dexieInstance.fish_families.toArray(),
      dexieInstance.fish_genera.toArray(),
      dexieInstance.fish_species.toArray(),
      dexieInstance.projects.toArray(),
      dexieInstance.collect_records.toArray(),
      dexieInstance.project_managements.toArray(),
      dexieInstance.project_profiles.toArray(),
      dexieInstance.project_sites.toArray(),
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
  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
  })

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

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
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  // add a uiState_pushToApi flag to one of each data type to simulate it being edited/created
  await dexieInstance.benthic_attributes.put({
    ...(await dexieInstance.benthic_attributes.toArray())[0],
    uiState_pushToApi: true,
  })
  await dexieInstance.collect_records.put({
    ...(await dexieInstance.collect_records.toArray())[0],
    uiState_pushToApi: true,
  })
  await dexieInstance.fish_species.put({
    ...(await dexieInstance.fish_species.toArray())[0],
    uiState_pushToApi: true,
  })

  await dexieInstance.project_managements.put({
    ...(await dexieInstance.project_managements.toArray())[0],
    uiState_pushToApi: true,
  })

  await dexieInstance.project_profiles.put({
    ...(await dexieInstance.project_profiles.toArray())[0],
    uiState_pushToApi: true,
  })

  await dexieInstance.project_sites.put({
    ...(await dexieInstance.project_sites.toArray())[0],
    uiState_pushToApi: true,
  })
  await dexieInstance.projects.put({
    ...(await dexieInstance.projects.toArray())[0],
    uiState_pushToApi: true,
  })
  const apiSync = new SyncApiDataIntoOfflineStorage({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
  })

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

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
