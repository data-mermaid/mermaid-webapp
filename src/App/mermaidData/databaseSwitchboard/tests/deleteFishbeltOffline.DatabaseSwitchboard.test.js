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
