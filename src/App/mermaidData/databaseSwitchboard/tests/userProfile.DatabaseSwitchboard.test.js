import { rest } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
  getDatabaseSwitchboardInstanceAuthenticatedOnline,
} from './testHelpers.DatabseSwitchboard'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('getUserProfile online returns data from the API', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnline()
  const userProfile = await dbInstance.getUserProfile()

  expect(userProfile).toEqual({
    id: 'fake-id',
    first_name: 'FakeFirstNameOnline',
  })
})
test('getUserProfile online returns error message upon API error', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.get(`${apiBaseUrl}/me`, (req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )

  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnline()

  expect.assertions(1)

  try {
    await dbInstance.getUserProfile()
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('getUserProfile offline returns data from local storage', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess()

  const userProfile = await dbInstance.getUserProfile()

  expect(userProfile).toEqual({
    id: 'fake-id',
    first_name: 'FakeFirstNameOffline',
  })
})
test('getUserProfile offline returns error message upon dexie error', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError()

  expect.assertions(1)

  try {
    await dbInstance.getUserProfile()
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
