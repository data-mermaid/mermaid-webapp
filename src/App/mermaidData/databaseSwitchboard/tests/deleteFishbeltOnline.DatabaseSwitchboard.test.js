/* eslint-disable max-nested-callbacks */
import { rest } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import {
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError,
} from './testHelpers.DatabseSwitchboard'

test('deleteFishBelt online returns error message upon dexie error', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError()

  expect.assertions(1)

  try {
    await dbInstance.deleteFishBelt({
      record: { id: 'someId' },
      profileId: '1',
      projectId: '1',
    })
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('deleteFishBelt online deletes the record', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

      (req, res, ctx) => {
        // this call captures the first part of this test which is
        // to save a fishbelt in order to then delete it
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

        return res.once(ctx.json(response))
      },
    ),

    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

      (req, res, ctx) => {
        const { _deleted, profile, project } = req.body.collect_records[0]

        if (!_deleted || !profile || !project) {
          // this causes the test to fail if deleteFishBelt doesnt send the api _deleted, profile of project info

          return res.once(ctx.status(400))
        }

        const response = { collect_records: [{ status_code: 204 }] }

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

  await dbInstance.saveFishBelt({
    record: fishBeltToBeDeleted,
    profileId: '1',
    projectId: '1',
  })

  /* this isnt an e2e test, so we will just check indexedDb. not what the API does.
    We need to access indexedDb directly because we are in online mode and
    the db switchboard's getFishBelt would try to hit the real or mocked API
    which is boyond the scope of the test.
     */
  expect(await dbInstance.dexieInstance.collectRecords.get('foo'))

  await dbInstance.deleteFishBelt({
    record: {
      id: 'foo',
    },
    profileId: '1',
    projectId: '1',
  })

  expect(
    await dbInstance.dexieInstance.collectRecords.get('foo'),
  ).toBeUndefined()
})
test('deleteFishBelt online returns a rejected promise if the status code from the API for the record is not successful', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/push/`, (req, res, ctx) => {
      // this call captures the first part of this test which is
      // to save a fishbelt in order to then delete it
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

      return res.once(ctx.json(response))
    }),

    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

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

  await dbInstance.saveFishBelt({
    record: fishBeltToBeDeleted,
    profileId: '1',
    projectId: '1',
  })

  /* this isnt an e2e test, so we will just check indexedDb. not what the API does.
    We need to access indexedDb directly because we are in online mode and
    the db switchboard's getFishBelt would try to hit the real or mocked API
    which is boyond the scope of the test.
     */
  expect(await dbInstance.dexieInstance.collectRecords.get('foo'))

  expect.assertions(1)

  await dbInstance
    .deleteFishBelt({
      record: {
        id: 'foo',
      },
      profileId: '1',
      projectId: '1',
    })

    .catch((error) => {
      expect(error.message).toEqual(
        'the API record returned from deleteFishBelt doesnt have a succussful status code',
      )
    })
})
test('deleteFishBelt online marks a record in indexedDB with _deleted in the case of a network error', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

      (req, res, ctx) => {
        // this call captures the first part of this test which is
        // to save a fishbelt in order to then delete it
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

        return res.once(ctx.json(response))
      },
    ),

    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

      (_req, res, _ctx) => {
        return res.networkError()
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

  await dbInstance.saveFishBelt({
    record: fishBeltToBeDeleted,
    profileId: '1',
    projectId: '1',
  })

  expect.assertions(3)

  /* this isnt an e2e test, so we will just check indexedDb. not what the API does.
    We need to access indexedDb directly because we are in online mode and
    the db switchboard's getFishBelt would try to hit the real or mocked API
    which is boyond the scope of the test.
     */
  expect(
    (await dbInstance.dexieInstance.collectRecords.get('foo'))._deleted,
  ).toBeFalsy()

  await dbInstance
    .deleteFishBelt({
      record: {
        id: 'foo',
      },
      profileId: '1',
      projectId: '1',
    })
    .catch((error) => expect(error.message).toEqual('Network Error'))

  expect(
    (await dbInstance.dexieInstance.collectRecords.get('foo'))._deleted,
  ).toBeTruthy()
})
