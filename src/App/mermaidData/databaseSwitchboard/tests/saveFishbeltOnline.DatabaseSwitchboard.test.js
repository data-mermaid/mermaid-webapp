/* eslint-disable max-nested-callbacks */
import { rest } from 'msw'
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
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        const { profile, project } = req.body.collect_records[0]
        const force = req.url.searchParams.get('force')

        if (!profile || !project || !force) {
          // this causes a test failure if the saveFishBelt
          // function fails to send the api: force=true, profile and project info

          return res.once(ctx.status(400))
        }

        const collectRecord = req.body.collect_records[0]

        const response = {
          collect_records: [
            {
              ...collectRecord,
              status_code: 200,
              _last_revision_num: 1000,
            },
          ],
        }

        return res(ctx.json(response))
      },
    ),
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

      (req, res, ctx) => {
        return res(ctx.json({ collect_records: { updates: [] } }))
      },
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
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        // this call captures the second call to push which will be a delete
        const collectRecord = req.body.collect_records[0]

        const response = {
          collect_records: [
            {
              ...collectRecord,
              status_code: 400,
              _last_revision_num: 1000,
            },
          ],
        }

        return res.once(ctx.json(response))
      },
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
    rest.post(`${import.meta.env.VITE_MERMAID_API}/push/`, (req, res, ctx) => {
      const fishbeltSentToApi = req.body.collect_records[0]

      // test fails if saveFishBeltOnline doesnt formulate protocol or profile properly
      if (fishbeltSentToApi.data.protocol !== 'fishbelt' && fishbeltSentToApi.profile !== '12345') {
        return res(ctx.status(400))
      }
      const collectRecordsWithStatusCodes = req.body.collect_records.map((record) => ({
        data: { ...record, _last_revision_num: 1000 },
        status_code: 200,
      }))

      const response = { collect_records: collectRecordsWithStatusCodes }

      return res(ctx.json(response))
    }),
    rest.post(`${import.meta.env.VITE_MERMAID_API}/pull/`, (req, res, ctx) => {
      const response = {
        collect_records: {
          updates: [{ ...fishBeltToBeSaved, _last_revision_num: 40 }],
          deletes: [],
          last_revision_num: 17,
        },
      }

      return res(ctx.json(response))
    }),
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
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

      (req, res, ctx) => {
        return res(ctx.json({ collect_records: { updates: [] } }))
      },
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
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

      (req, res, ctx) => {
        return res(
          ctx.json({
            collect_records: {
              updates: [{ id: 'cantMockWhatIDFrontEndGeneratesToMatchSoCantTest' }],
            },
          }),
        )
      },
    ),
    rest.post(`${import.meta.env.VITE_MERMAID_API}/push/`, (req, res, ctx) => {
      const collectRecordsWithStatusCodes = req.body.collect_records.map((record) => ({
        data: { ...record, _last_revision_num: 1000 },
        status_code: 200,
      }))

      const response = { collect_records: collectRecordsWithStatusCodes }

      return res(ctx.json(response))
    }),
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
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

      (req, res, ctx) => {
        return res(
          ctx.json({
            collect_records: {
              updates: [
                {
                  ...recordToBeSaved,
                  _last_revision_num: 45,
                },
              ],
            },
          }),
        )
      },
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
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (_req, res, _ctx) => {
        return res.networkError()
      },
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

  expect(recordStoredInDexie).toBeDefined()
  expect(recordStoredInDexie.data).toBeDefined()
  expect(recordStoredInDexie.profile).toEqual(fishBeltToBeSaved.profile)
  expect(recordStoredInDexie.randomUnexpectedProperty).toEqual(
    fishBeltToBeSaved.randomUnexpectedProperty,
  )
  expect(recordStoredInDexie._last_revision_num).not.toBeDefined()
})
