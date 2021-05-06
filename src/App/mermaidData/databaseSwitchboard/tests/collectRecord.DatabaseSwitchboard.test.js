import { validate as validateUuid } from 'uuid'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'

import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError,
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

describe('Save fishbelt', () => {
  test('saveFishbelt throws error if any parameters are missing', async () => {
    const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

    expect.assertions(4)

    try {
      await dbInstance.saveFishBelt()
    } catch (error) {
      expect(error.message).toEqual(
        'saveFishBelt expects record, profileId, and projectId parameters',
      )
    }
    try {
      await dbInstance.saveFishBelt({})
    } catch (error) {
      expect(error.message).toEqual(
        'saveFishBelt expects record, profileId, and projectId parameters',
      )
    }

    try {
      await dbInstance.saveFishBelt({}, undefined, '1')
    } catch (error) {
      expect(error.message).toEqual(
        'saveFishBelt expects record, profileId, and projectId parameters',
      )
    }

    try {
      await dbInstance.saveFishBelt({}, '1')
    } catch (error) {
      expect(error.message).toEqual(
        'saveFishBelt expects record, profileId, and projectId parameters',
      )
    }
  })
  describe('Online save fishbelt', () => {
    test('saveFishBelt online returns saved record with protocol info automatically included', async () => {
      const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

      const fishBeltToBeSaved = {
        id: 'foo',
        data: {},
        profile: '1234',
        randomUnexpectedProperty: 'whatever',
      }

      const savedFishBeltResponse = await dbInstance.saveFishBelt(
        fishBeltToBeSaved,
        '1',
        '1',
      )

      expect(savedFishBeltResponse.id).toEqual(fishBeltToBeSaved.id)
      expect(savedFishBeltResponse.data).toEqual({ protocol: 'fishbelt' })
      expect(savedFishBeltResponse.profile).toEqual(fishBeltToBeSaved.profile)
      expect(savedFishBeltResponse.randomUnexpectedProperty).toEqual(
        fishBeltToBeSaved.randomUnexpectedProperty,
      )
    })
    test('saveFishBelt offline replaces previous fishBelt record with same id', async () => {
      const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

      await dbInstance.saveFishBelt(
        {
          id: 'foo',
          data: {},
          profile: '1234',
          initialProperty: 'whatever',
        },
        '1',
        '1',
      )

      const replacementFishbelt = {
        id: 'foo',
        data: { randomProperty: 'A' },
        profile: 'ABCD',
      }

      await dbInstance.saveFishBelt(replacementFishbelt, '1', '1')

      const savedFishBelt = await dbInstance.getFishBelt('foo')

      expect(savedFishBelt.data.randomProperty).toEqual(
        replacementFishbelt.data.randomProperty,
      )
      expect(savedFishBelt.profile).toEqual(replacementFishbelt.profile)
      expect(savedFishBelt.initialProperty).toEqual(
        replacementFishbelt.initialProperty,
      )
    })
    test('saveFishBelt offline returns saved record including an id if one isnt supplied', async () => {
      const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

      const savedFishBeltResponse = await dbInstance.saveFishBelt(
        {
          data: {},
          profile: '1234',
          randomUnexpectedProperty: 'whatever',
        },
        '1',
        '1',
      )

      expect(validateUuid(savedFishBeltResponse.id)).toBeTruthy()
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
  describe('Offline safe fishbelt', () => {
    test('saveFishBelt offline returns saved record with protocol info automatically included', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

      const fishBeltToBeSaved = {
        id: 'foo',
        data: {},
        profile: '1234',
        randomUnexpectedProperty: 'whatever',
      }

      const savedFishBeltResponse = await dbInstanceOffline.saveFishBelt(
        fishBeltToBeSaved,
        '1',
        '1',
      )

      expect(savedFishBeltResponse.id).toEqual(fishBeltToBeSaved.id)
      expect(savedFishBeltResponse.data).toEqual({ protocol: 'fishbelt' })
      expect(savedFishBeltResponse.profile).toEqual(fishBeltToBeSaved.profile)
      expect(savedFishBeltResponse.randomUnexpectedProperty).toEqual(
        fishBeltToBeSaved.randomUnexpectedProperty,
      )
    })
    test('saveFishBelt offline replaces previous fishBelt record with same id', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

      await dbInstanceOffline.saveFishBelt(
        {
          id: 'foo',
          data: {},
          profile: '1234',
          initialProperty: 'whatever',
        },
        '1',
        '1',
      )

      const replacementFishbelt = {
        id: 'foo',
        data: { randomProperty: 'A' },
        profile: 'ABCD',
      }

      await dbInstanceOffline.saveFishBelt(replacementFishbelt, '1', '1')

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

      const savedFishBeltResponse = await dbInstanceOffline.saveFishBelt(
        {
          data: {},
          profile: '1234',
          randomUnexpectedProperty: 'whatever',
        },
        '1',
        '1',
      )

      expect(validateUuid(savedFishBeltResponse.id)).toBeTruthy()
    })
    test('saveFishBelt offline returns error message upon dexie error', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

      expect.assertions(1)

      try {
        await dbInstanceOffline.saveFishBelt({}, '1', '1')
      } catch (error) {
        expect(error.message).toBeTruthy()
      }
    })
  })
})

describe('Delete fishbelt', () => {
  describe('Online delete fishbelt', () => {})
  describe('Offline delete fishbelt', () => {
    test('deleteFishBelt offline returns error message upon dexie error', async () => {
      const dbInstanceOffline = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

      expect.assertions(1)

      try {
        await dbInstanceOffline.deleteFishBelt('someId')
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

      await dbInstanceOffline.saveFishBelt(fishBeltToBeDeleted, '1', '1')

      expect(await dbInstanceOffline.getFishBelt('foo'))

      await dbInstanceOffline.deleteFishBelt('foo')

      expect(await dbInstanceOffline.getFishBelt('foo')).toBeUndefined()
    })
  })
})
