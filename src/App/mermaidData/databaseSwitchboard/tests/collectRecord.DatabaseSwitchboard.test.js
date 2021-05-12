/* eslint-disable max-nested-callbacks */
import { rest } from 'msw'
import { validate as validateUuid } from 'uuid'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError,
} from './testHelpers.DatabseSwitchboard'

describe('Save fishbelt', () => {
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
  describe('Online save fishbelt', () => {
    test('saveFishBelt online sends properties that the API expects to function properly', async () => {
      mockMermaidApiAllSuccessful.use(
        rest.post(
          `${process.env.REACT_APP_MERMAID_API}/push/`,

          (req, res, ctx) => {
            const { profile, project } = req.body.collect_records[0]

            if (!profile || !project) {
              // this causes a test failure if the saveFishBelt function fails to send the api profile and project info

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

      expect.assertions(1)

      await dbInstance
        .saveFishBelt({
          record: fishBeltToBeDeleted,
          profileId: '1',
          projectId: '1',
        })
        .catch((error) => {
          expect(error.message).toEqual(
            'the API record returned from saveFishBelt doesnt have a succussful status code',
          )
        })

      /* this isnt an e2e test, so we will just check indexedDb. not what the API does.
    We need to access indexedDb directly because we are in online mode and
    the db switchboard's getFishBelt would try to hit the real or mocked API
    which is boyond the scope of the test.
     */
      expect(await dbInstance.dexieInstance.collectRecords.get('foo'))
    })
    test('saveFishBelt online returns saved record with protocol info automatically included', async () => {
      const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

      const fishBeltToBeSaved = {
        id: 'foo',
        data: {},
        profile: '1234',
        randomUnexpectedProperty: 'whatever',
      }

      const savedFishBeltResponse = await dbInstance.saveFishBelt({
        record: fishBeltToBeSaved,
        profileId: '1',
        projectId: '1',
      })

      expect(savedFishBeltResponse.id).toEqual(fishBeltToBeSaved.id)
      expect(savedFishBeltResponse.data).toEqual({ protocol: 'fishbelt' })
      expect(savedFishBeltResponse.profile).toEqual(fishBeltToBeSaved.profile)
      expect(savedFishBeltResponse.randomUnexpectedProperty).toEqual(
        fishBeltToBeSaved.randomUnexpectedProperty,
      )
    })
    test('saveFishBelt online replaces previous fishBelt record with same id (acts like a put)', async () => {
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
      the db switchboard's getFishBelt would try to hit the real or mocked API
      which is boyond the scope of the test.
     */
      const savedFishBelt = await dbInstance.dexieInstance.collectRecords.get(
        'foo',
      )

      expect(savedFishBelt.data.randomProperty).toEqual(
        replacementFishbelt.data.randomProperty,
      )
      expect(savedFishBelt.profile).toEqual(replacementFishbelt.profile)
      expect(savedFishBelt.initialProperty).toEqual(
        replacementFishbelt.initialProperty,
      )
    })
    test('saveFishBelt online returns saved record including id, project, profile if those properties dont exist on the record', async () => {
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
    })
    test('saveFishBelt online returns saved record including existing id, project, profile ', async () => {
      const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

      const savedFishBeltResponse = await dbInstance.saveFishBelt({
        record: {
          data: {},
          profile: '1234',
          project: '4321',
          randomUnexpectedProperty: 'whatever',
        },
        profileId: '1',
        projectId: '1',
      })

      expect(validateUuid(savedFishBeltResponse.id)).toBeTruthy()
      expect(savedFishBeltResponse.profile).toEqual('1234')
      expect(savedFishBeltResponse.project).toEqual('4321')
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
  })
  describe('Offline save fishbelt', () => {
    test('saveFishBelt offline returns saved record with protocol info automatically included', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

      const fishBeltToBeSaved = {
        id: 'foo',
        data: {},
        profile: '1234',
        randomUnexpectedProperty: 'whatever',
      }

      const savedFishBeltResponse = await dbInstanceOffline.saveFishBelt({
        record: fishBeltToBeSaved,
        profileId: '1',
        projectId: '1',
      })

      expect(savedFishBeltResponse.id).toEqual(fishBeltToBeSaved.id)
      expect(savedFishBeltResponse.data).toEqual({ protocol: 'fishbelt' })
      expect(savedFishBeltResponse.profile).toEqual(fishBeltToBeSaved.profile)
      expect(savedFishBeltResponse.randomUnexpectedProperty).toEqual(
        fishBeltToBeSaved.randomUnexpectedProperty,
      )
    })
    test('saveFishBelt offline replaces previous fishBelt record with same id', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

      await dbInstanceOffline.saveFishBelt({
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

      await dbInstanceOffline.saveFishBelt({
        record: replacementFishbelt,
        profileId: '1',
        projectId: '1',
      })

      const savedFishBelt = await dbInstanceOffline.getFishBelt('foo')

      expect(savedFishBelt.data.randomProperty).toEqual(
        replacementFishbelt.data.randomProperty,
      )
      expect(savedFishBelt.profile).toEqual(replacementFishbelt.profile)
      expect(savedFishBelt.initialProperty).toEqual(
        replacementFishbelt.initialProperty,
      )
    })
    test('saveFishBelt offline returns saved record including an id if one isnt supplied', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

      const savedFishBeltResponse = await dbInstanceOffline.saveFishBelt({
        record: {
          data: {},
          profile: '1234',
          randomUnexpectedProperty: 'whatever',
        },
        profileId: '1',
        projectId: '1',
      })

      expect(validateUuid(savedFishBeltResponse.id)).toBeTruthy()
    })
    test('saveFishBelt offline returns error message upon dexie error', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

      expect.assertions(1)

      try {
        await dbInstanceOffline.saveFishBelt({
          record: {},
          profileId: '1',
          projectId: '1',
        })
      } catch (error) {
        expect(error.message).toBeTruthy()
      }
    })
  })
})

describe('Delete fishbelt', () => {
  describe('Online delete fishbelt', () => {
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
    test('deleteFishBelt online returns a rejected promise if the status code from the API for the record isn not successful', async () => {
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
            'the API record returned from deletFishBelt doesnt have a succussful status code',
          )
        })
    })
  })
  describe('Offline delete fishbelt', () => {
    test('deleteFishBelt offline returns error message upon dexie error', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

      expect.assertions(1)

      try {
        await dbInstanceOffline.deleteFishBelt({
          record: { id: 'someId' },
          profileId: '1',
          projectId: '1',
        })
      } catch (error) {
        expect(error.message).toBeTruthy()
      }
    })
    test('deleteFishBelt offline deletes the record', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

      const fishBeltToBeDeleted = {
        id: 'foo',
        data: {},
        profile: '1234',
        randomUnexpectedProperty: 'whatever',
      }

      await dbInstanceOffline.saveFishBelt({
        record: fishBeltToBeDeleted,
        profileId: '1',
        projectId: '1',
      })

      expect(await dbInstanceOffline.getFishBelt('foo'))

      await dbInstanceOffline.deleteFishBelt({
        record: { id: 'foo' },
        profileId: '1',
        projectId: '1',
      })

      expect(await dbInstanceOffline.getFishBelt('foo')).toBeUndefined()
    })
  })
})
