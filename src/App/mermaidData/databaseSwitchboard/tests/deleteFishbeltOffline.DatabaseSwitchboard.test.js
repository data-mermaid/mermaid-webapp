/* eslint-disable max-nested-callbacks */
import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
} from './testHelpers.DatabseSwitchboard'

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
  test('deleteFishBelt offline deletes the record if there is no corresponding server record', async () => {
    const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

    const fishBeltToBeDeleted = {
      id: 'foo',
      data: {},
      profile: '1234',
      randomUnexpectedProperty: 'whatever',
      _last_revision_num: undefined, // indicates that there is no server copy of the record
    }

    // save a record in IDB so we can delete it
    await dbInstanceOffline.dexieInstance.collect_records.put(fishBeltToBeDeleted)

    await dbInstanceOffline.deleteFishBelt({
      record: fishBeltToBeDeleted,
      profileId: '1',
      projectId: '1',
    })

    expect(await dbInstanceOffline.getCollectRecord({ id: 'foo', userId: '1' })).toBeUndefined()
  })
  test('deleteFishBelt offline marks the record with a _deleted property if there is a corresponding server record', async () => {
    const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

    const fishBeltToBeDeleted = {
      id: 'foo',
      data: {},
      profile: '1234',
      randomUnexpectedProperty: 'whatever',
      _last_revision_num: 1, // indicates that there is a server copy of the record
    }

    // save a record in IDB so we can delete it
    await dbInstanceOffline.dexieInstance.collect_records.put(fishBeltToBeDeleted)

    await dbInstanceOffline.deleteFishBelt({
      record: fishBeltToBeDeleted,
      profileId: '1',
      projectId: '1',
    })

    expect((await dbInstanceOffline.dexieInstance.collect_records.get('foo'))._deleted).toBeTruthy()
  })
})
