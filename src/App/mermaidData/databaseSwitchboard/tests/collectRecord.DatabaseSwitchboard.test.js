import { validate as validateUuid } from 'uuid'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'

import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
} from './testHelpers.DatabseSwitchboard'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('saveFishBelt offline returns saved record with protocol info automatically included', async () => {
  const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess()

  const fishBeltToBeSaved = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  }

  const savedFishBeltResponse = await dbInstanceOffline.saveFishBelt(
    fishBeltToBeSaved,
  )

  expect(savedFishBeltResponse.id).toEqual(fishBeltToBeSaved.id)
  expect(savedFishBeltResponse.data).toEqual({ protocol: 'fishbelt' })
  expect(savedFishBeltResponse.profile).toEqual(fishBeltToBeSaved.profile)
  expect(savedFishBeltResponse.randomUnexpectedProperty).toEqual(
    fishBeltToBeSaved.randomUnexpectedProperty,
  )
})
test('saveFishBelt offline replaces previous fishBelt record with same id', async () => {
  const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess()

  await dbInstanceOffline.saveFishBelt({
    id: 'foo',
    data: {},
    profile: '1234',
    initialProperty: 'whatever',
  })

  const replacementFishbelt = {
    id: 'foo',
    data: { a: 'A' },
    profile: 'ABCD',
  }

  await dbInstanceOffline.saveFishBelt(replacementFishbelt)

  const savedFishBelt = await dbInstanceOffline.getFishBelt('foo')

  expect(savedFishBelt.data.a).toEqual(replacementFishbelt.data.a)
  expect(savedFishBelt.profile).toEqual(replacementFishbelt.profile)
  expect(savedFishBelt.initialProperty).toEqual(
    replacementFishbelt.initialProperty,
  )
})
test('saveFishBelt offline returns saved record including an id if one isnt supplied', async () => {
  const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess()

  const savedFishBeltResponse = await dbInstanceOffline.saveFishBelt({
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  })

  expect(validateUuid(savedFishBeltResponse.id)).toBeTruthy()
})
test('saveFishBelt offline returns error message upon dexie error', async () => {
  const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

  expect.assertions(1)

  try {
    await dbInstanceOffline.saveFishBelt()
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('deleteFishBelt offline deletes the record', async () => {
  const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess()

  const fishBeltToBeDeleted = {
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  }

  await dbInstanceOffline.saveFishBelt(fishBeltToBeDeleted)

  expect(await dbInstanceOffline.getFishBelt('foo'))

  await dbInstanceOffline.deleteFishBelt('foo')

  expect(await dbInstanceOffline.getFishBelt('foo')).toBeUndefined()
})
test('deleteFishBelt offline returns error message upon dexie error', async () => {
  const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

  expect.assertions(1)

  try {
    await dbInstanceOffline.deleteFishBelt('someId')
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
