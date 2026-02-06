import { http, HttpResponse } from 'msw'
import { validate as validateUuid } from 'uuid'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import {
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError,
} from './testHelpers.DatabseSwitchboard'

test('saveFishbelt throws error if any parameters are missing', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  expect.assertions(4)

  try {
    await dbInstance.saveFishBelt({})
  } catch (error) {
    expect(error.message).toEqual(
      'saveFishBelt expects record, profileId, and projectId parameters',
    )
  }
  try {
    await dbInstance.saveFishBelt({ record: {} })
  } catch (error) {
    expect(error.message).toEqual(
      'saveFishBelt expects record, profileId, and projectId parameters',
    )
  }

  try {
    await dbInstance.saveFishBelt({
      record: {},
      projectId: '1',
    })
  } catch (error) {
    expect(error.message).toEqual(
      'saveFishBelt expects record, profileId, and projectId parameters',
    )
  }

  try {
    await dbInstance.saveFishBelt({ record: {}, profileId: '1' })
  } catch (error) {
    expect(error.message).toEqual(
      'saveFishBelt expects record, profileId, and projectId parameters',
    )
  }
})

test('saveFishBelt online sends properties that the API expects to function properly', async () => {
  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,
      async ({ request }) => {
        const body = await request.json()
        const { profile, project } = body.collect_records[0]
        const force = new URL(request.url).searchParams.get('force')

        if (!profile || !project || !force) {
          // this causes a test failure if the saveFishBelt
          // function fails to send the api: force=true, profile and project info
          return new HttpResponse(null, { status: 400 })
        }

        const collectRecord = body.collect_records[0]

        const response = {
          collect_records: [
            {
              ...collectRecord,
              status_code: 200,
              _last_revision_num: 1000,
            },
          ],
        }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        return HttpResponse.json({ collect_records: { updates: [] } })
      },
      { once: true },
    ),
  )

  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  const fishBeltToBeSaved = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  }

  await dbInstance.saveFishBelt({
    record: fishBeltToBeSaved,
    profileId: '1',
    projectId: '1',
  })
})
test('saveFishBelt online returns a rejected promise if the status code from the API for the record is not successful', async () => {
  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,
      async ({ request }) => {
        // this call captures the second call to push which will be a delete
        const body = await request.json()
        const collectRecord = body.collect_records[0]

        const response = {
          collect_records: [
            {
              ...collectRecord,
              status_code: 400,
              _last_revision_num: 1000,
            },
          ],
        }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
  )
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  const fishBeltToBeDeleted = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  }

  expect.assertions(1)

  await dbInstance
    .saveFishBelt({
      record: fishBeltToBeDeleted,
      profileId: '1',
      projectId: '1',
    })
    .catch((error) => {
      expect(error.message).toEqual(
        'the API record returned from saveFishBelt doesnt have a successful status code',
      )
    })

  /* this isnt an e2e test, so we will just check indexedDb. not what the API does.
    We need to access indexedDb directly because we are in online mode and
    the db switchboard's getCollectRecord would try to hit the real or mocked API
    which is boyond the scope of the test.
     */
  expect(await dbInstance.dexiePerUserDataInstance.collect_records.get('foo'))
})
test('saveFishBelt online returns saved record with protocol info automatically included and stores it ', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  const fishBeltToBeSaved = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  }

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,
      async ({ request }) => {
        const body = await request.json()
        const fishbeltSentToApi = body.collect_records[0]

        // test fails if saveFishBeltOnline doesnt formulate protocol or profile properly
        if (
          fishbeltSentToApi.data.protocol !== 'fishbelt' &&
          fishbeltSentToApi.profile !== '12345'
        ) {
          return new HttpResponse(null, { status: 400 })
        }
        const collectRecordsWithStatusCodes = body.collect_records.map((record) => ({
          data: { ...record, _last_revision_num: 1000 },
          status_code: 200,
        }))

        const response = { collect_records: collectRecordsWithStatusCodes }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        const response = {
          collect_records: {
            updates: [{ ...fishBeltToBeSaved, _last_revision_num: 40 }],
            deletes: [],
            last_revision_num: 17,
          },
        }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
  )

  const savedFishBeltResponse = await dbInstance.saveFishBelt({
    record: fishBeltToBeSaved,
    profileId: '1',
    projectId: '1',
  })

  expect(savedFishBeltResponse.id).toEqual(fishBeltToBeSaved.id)
  expect(savedFishBeltResponse.profile).toEqual(fishBeltToBeSaved.profile)
  expect(savedFishBeltResponse.randomUnexpectedProperty).toEqual(
    fishBeltToBeSaved.randomUnexpectedProperty,
  )

  const recordStoredInDexie = await dbInstance.dexiePerUserDataInstance.collect_records.get('foo')

  expect(recordStoredInDexie.profile).toEqual('1234')
  // _last_revision_num proves that the record comes from the server
  expect(recordStoredInDexie._last_revision_num).toBeDefined()
})
test('saveFishBelt online replaces previous fishBelt record with same id (acts like a put)', async () => {
  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        return HttpResponse.json({ collect_records: { updates: [] } })
      },
      { once: true },
    ),
  )
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbInstance.saveFishBelt({
    record: {
      id: 'foo',
      data: {},
      profile: '1234',
      initialProperty: 'whatever',
    },
    profileId: '1',
    projectId: '1',
  })

  const replacementFishbelt = {
    id: 'foo',
    data: { randomProperty: 'A' },
    profile: 'ABCD',
  }

  await dbInstance.saveFishBelt({
    record: replacementFishbelt,
    profileId: '1',
    projectId: '1',
  })

  /* this isnt an e2e test, so we will just check indexedDb. not what the API does.
      We need to access indexedDb directly because we are in online mode and
      the db switchboard's getCollectRecord would try to hit the real or mocked API
      which is boyond the scope of the test.
     */
  const savedFishBelt = await dbInstance.dexiePerUserDataInstance.collect_records.get('foo')

  expect(savedFishBelt.data.randomProperty).toEqual(replacementFishbelt.data.randomProperty)
  expect(savedFishBelt.profile).toEqual(replacementFishbelt.profile)
  expect(savedFishBelt.initialProperty).toEqual(replacementFishbelt.initialProperty)
})
test('saveFishBelt online returns saved record including id, project, profile, if those properties dont exist on the record', async () => {
  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        return HttpResponse.json({
          collect_records: {
            updates: [{ id: 'cantMockWhatIDFrontEndGeneratesToMatchSoCantTest' }],
          },
        })
      },
      { once: true },
    ),
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,
      async ({ request }) => {
        const body = await request.json()
        const collectRecordsWithStatusCodes = body.collect_records.map((record) => ({
          data: { ...record, _last_revision_num: 1000 },
          status_code: 200,
        }))

        const response = { collect_records: collectRecordsWithStatusCodes }

        return HttpResponse.json(response)
      },
      { once: true },
    ),
  )
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  const savedFishBeltResponse = await dbInstance.saveFishBelt({
    record: {
      data: {},
      randomUnexpectedProperty: 'whatever',
    },
    profileId: '1',
    projectId: '1',
  })

  expect(validateUuid(savedFishBeltResponse.id)).toBeTruthy()
  expect(savedFishBeltResponse.profile).toEqual('1')
  expect(savedFishBeltResponse.project).toEqual('1')

  // because we cant mock a pull response with the same id that the FE generated to be stored in IDB, we cant test storage
})
test('saveFishBelt online returns and stores a saved record including existing id, project, profile,', async () => {
  const recordToBeSaved = {
    id: 'foo',
    data: {},
    profile: '1234',
    project: '4321',
    randomUnexpectedProperty: 'whatever',
  }

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,
      () => {
        return HttpResponse.json({
          collect_records: {
            updates: [
              {
                ...recordToBeSaved,
                _last_revision_num: 45,
              },
            ],
          },
        })
      },
      { once: true },
    ),
  )
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  const savedFishBeltResponse = await dbInstance.saveFishBelt({
    record: recordToBeSaved,
    profileId: '1',
    projectId: '1',
  })

  expect(validateUuid(savedFishBeltResponse.id)).toBeDefined()
  expect(savedFishBeltResponse.profile).toEqual('1234')
  expect(savedFishBeltResponse.project).toEqual('4321')

  const recordStoredInDexie = await dbInstance.dexiePerUserDataInstance.collect_records.get(
    savedFishBeltResponse.id,
  )

  expect(recordStoredInDexie.profile).toEqual('1234')
  expect(recordStoredInDexie.project).toEqual('4321')
  // _last_revision_num proves that the record comes from the server
  expect(recordStoredInDexie._last_revision_num).toBeDefined()
})
test('saveFishBelt online returns error message upon dexie error', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError()

  expect.assertions(1)

  try {
    await dbInstance.saveFishBelt({}, '1', '1')
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('saveFishBelt online saves the record in indexeddb in the case of network error', async () => {
  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,
      () => {
        return HttpResponse.error()
      },
      { once: true },
    ),
  )

  expect.assertions(6)
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  const fishBeltToBeSaved = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  }

  await dbInstance
    .saveFishBelt({
      record: fishBeltToBeSaved,
      profileId: '1',
      projectId: '1',
    })
    .catch((error) => expect(error.message).toEqual('Network Error'))

  const recordStoredInDexie = await dbInstance.dexiePerUserDataInstance.collect_records.get('foo')

  expect(recordStoredInDexie.id).toEqual(fishBeltToBeSaved.id)
  expect(recordStoredInDexie.data).toEqual(fishBeltToBeSaved.data)
  expect(recordStoredInDexie.profile).toEqual(fishBeltToBeSaved.profile)
  expect(recordStoredInDexie.randomUnexpectedProperty).toEqual(
    fishBeltToBeSaved.randomUnexpectedProperty,
  )
})
