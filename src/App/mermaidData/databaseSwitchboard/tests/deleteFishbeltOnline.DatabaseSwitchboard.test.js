import { rest } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import {
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError,
} from './testHelpers.DatabseSwitchboard'

test('deleteSampleUnit online returns error message upon dexie error', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError()

  expect.assertions(1)

  try {
    await dbInstance.deleteSampleUnit({
      record: { id: 'someId' },
      profileId: '1',
      projectId: '1',
    })
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('deleteSampleUnit online deletes the IDB record if there is no corresponding record on the server', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        // proves that the api call is skipped, otherwise the test will fail
        return res.once(ctx.status(400))
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

  await dbInstance.dexiePerUserDataInstance.collect_records.put(fishBeltToBeDeleted)

  await dbInstance.deleteSampleUnit({
    record: fishBeltToBeDeleted, // doesnt have a  _last_revision_num property, which means the API call get skipped
    profileId: '1',
    projectId: '1',
  })

  expect(await dbInstance.dexiePerUserDataInstance.collect_records.get('foo')).toBeUndefined()
})
test('deleteSampleUnit online deletes the record if there is a corresponding copy on the server', async () => {
  const fishBeltToBeDeleted = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
    _last_revision_num: 1, // indicate that there is a server copy
  }

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        const { _deleted, profile, project } = req.body.collect_records[0]
        const force = req.url.searchParams.get('force')

        if (!_deleted || !profile || !project || !force) {
          // this causes the test to fail if deleteSampleUnit doesnt
          // send the api: force=true, _deleted, profile or project info

          return res.once(ctx.status(400))
        }

        const response = {
          collect_records: [{ status_code: 204 }],
          proofOfServerCall: true,
        }

        return res.once(ctx.json(response))
      },
    ),
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

      (req, res, ctx) => {
        return res(
          ctx.json({
            collect_records: {
              updates: [],
              deletes: [fishBeltToBeDeleted],
            },
          }),
        )
      },
    ),
  )
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  // save a record in IDB so we can delete it
  await dbInstance.dexiePerUserDataInstance.collect_records.put(fishBeltToBeDeleted)

  const serverResponse = await dbInstance.deleteSampleUnit({
    record: fishBeltToBeDeleted,
    profileId: '1',
    projectId: '1',
  })

  expect(await dbInstance.dexiePerUserDataInstance.collect_records.get('foo')).toBeUndefined()
  expect(serverResponse.data.proofOfServerCall).toBeTruthy()
})
test('deleteSampleUnit online returns a rejected promise if the status code from the API for the record is not successful', async () => {
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

  expect.assertions(1)

  const fishBeltToBeDeleted = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
    _last_revision_num: 1, // indicate that there is a server copy
  }

  // save a record in IDB so we can delete it
  await dbInstance.dexiePerUserDataInstance.collect_records.put(fishBeltToBeDeleted)

  await dbInstance
    .deleteSampleUnit({
      record: {
        id: 'foo',
        _last_revision_num: 1,
      },
      profileId: '1',
      projectId: '1',
    })
    .catch((error) => {
      expect(error.message).toEqual(
        'the API record returned from deleteSampleUnit doesnt have a successful status code',
      )
    })
})
test('deleteSampleUnit online marks a record in indexedDB with _deleted in the case of a network error', async () => {
  expect.assertions(2)
  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

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
    _last_revision_num: 1, // indicate that there is a server copy
  }

  // save a record in IDB so we can delete it
  await dbInstance.dexiePerUserDataInstance.collect_records.put(fishBeltToBeDeleted)

  await dbInstance
    .deleteSampleUnit({
      record: {
        id: 'foo',
        _last_revision_num: 1,
      },
      profileId: '1',
      projectId: '1',
    })
    .catch((error) => expect(error.message).toEqual('Network Error'))

  expect(
    (await dbInstance.dexiePerUserDataInstance.collect_records.get('foo'))._deleted,
  ).toBeTruthy()
})
