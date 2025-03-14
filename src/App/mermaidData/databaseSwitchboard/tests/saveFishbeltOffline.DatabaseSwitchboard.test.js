import { validate as validateUuid } from 'uuid'
import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
} from './testHelpers.DatabseSwitchboard'

test('saveFishbelt throws error if any parameters are missing', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

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

  const savedFishBelt = await dbInstanceOffline.getCollectRecord('foo')

  expect(savedFishBelt.data.randomProperty).toEqual(replacementFishbelt.data.randomProperty)
  expect(savedFishBelt.profile).toEqual(replacementFishbelt.profile)
  expect(savedFishBelt.initialProperty).toEqual(replacementFishbelt.initialProperty)
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
