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

test('saveFishBelt offline returns saved record', async () => {
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

  expect(savedFishBeltResponse).toEqual(fishBeltToBeSaved)
})
test('saveFishBelt offline replaces previous fishBelt record with same id', async () => {
  const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess()

  await dbInstanceOffline.saveFishBelt({
    id: 'foo',
    data: {},
    profile: '1234',
    randomUnexpectedProperty: 'whatever',
  })

  const replacementFishbelt = {
    id: 'foo',
    data: { a: 'A' },
    profile: 'ABCD',
  }

  await dbInstanceOffline.saveFishBelt(replacementFishbelt)

  const savedFishBelt = await dbInstanceOffline.getFishBelt('foo')

  expect(savedFishBelt).toEqual(replacementFishbelt)
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

  expect(await dbInstanceOffline.getFishBelt('foo')).toEqual(
    fishBeltToBeDeleted,
  )

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
