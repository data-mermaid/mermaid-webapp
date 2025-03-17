import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
} from './testHelpers.DatabseSwitchboard'

describe('Offline delete fishbelt', () => {
  test('deleteSampleUnit offline returns error message upon dexie error', async () => {
    const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

    expect.assertions(1)

    try {
      await dbInstanceOffline.deleteSampleUnit({
        record: { id: 'someId' },
        profileId: '1',
        projectId: '1',
      })
    } catch (error) {
      expect(error.message).toBeTruthy()
    }
  })
  test('deleteSampleUnit offline deletes the record if there is no corresponding server record', async () => {
    const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

    const fishBeltToBeDeleted = {
      id: 'foo',
      data: {},
      profile: '1234',
      randomUnexpectedProperty: 'whatever',
      _last_revision_num: undefined, // indicates that there is no server copy of the record
    }

    // save a record in IDB so we can delete it
    await dbInstanceOffline.dexiePerUserDataInstance.collect_records.put(fishBeltToBeDeleted)

    await dbInstanceOffline.deleteSampleUnit({
      record: fishBeltToBeDeleted,
      profileId: '1',
      projectId: '1',
    })

    expect(await dbInstanceOffline.getCollectRecord('foo')).toBeUndefined()
  })
  test('deleteSampleUnit offline marks the record with a _deleted property if there is a corresponding server record', async () => {
    const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

    const fishBeltToBeDeleted = {
      id: 'foo',
      data: {},
      profile: '1234',
      randomUnexpectedProperty: 'whatever',
      _last_revision_num: 1, // indicates that there is a server copy of the record
    }

    // save a record in IDB so we can delete it
    await dbInstanceOffline.dexiePerUserDataInstance.collect_records.put(fishBeltToBeDeleted)

    await dbInstanceOffline.deleteSampleUnit({
      record: fishBeltToBeDeleted,
      profileId: '1',
      projectId: '1',
    })

    expect(
      (await dbInstanceOffline.dexiePerUserDataInstance.collect_records.get('foo'))._deleted,
    ).toBeTruthy()
  })
})
