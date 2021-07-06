import { rest } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import {
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess,
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError,
  getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess,
} from './testHelpers.DatabseSwitchboard'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test('getUserProfile online returns data from the API', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const userProfile = await dbInstance.getUserProfile()

  expect(userProfile).toEqual({
    id: 'fake-id',
    first_name: 'FakeFirstNameOnline',
    last_name: 'FakeLastNameOnline',
    full_name: 'FakeFirstNameOnline FakeLastNameOnline',
  })
})
test('getUserProfile online returns error message upon API error', async () => {
  mockMermaidApiAllSuccessful.use(
    rest.get(`${apiBaseUrl}/me`, (req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )

  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  expect.assertions(1)

  try {
    await dbInstance.getUserProfile()
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('getUserProfile offline returns data from local storage', async () => {
  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess()

  const userProfile = await dbInstance.getUserProfile()

  expect(userProfile).toEqual({
    id: 'fake-id',
    first_name: 'FakeFirstNameOffline',
    last_name: 'FakeLastNameOffline',
    full_name: 'FakeFirstNameOffline FakeLastNameOffline',
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
