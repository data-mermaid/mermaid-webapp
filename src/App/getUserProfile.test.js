import { rest } from 'msw'
import {
  getMockDexieInstanceAllSuccess,
  getMockDexieInstanceThatProducesErrors,
} from '../testUtilities/mockDexie'
import mockMermaidApiAllSuccessful from '../testUtilities/mockMermaidApiAllSuccessful'
import getUserProfile from './getUserProfile'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API
const auth0Token = 'fake token'

test('getUserProfile online returns data from the API', async () => {
  const userProfile = await getUserProfile({
    apiBaseUrl,
    auth0Token,
    dexieInstance: getMockDexieInstanceAllSuccess(),
    isMermaidAuthenticated: true,
    isAppOnline: true,
  })

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

  expect.assertions(1)

  try {
    await getUserProfile({
      apiBaseUrl: process.env.REACT_APP_MERMAID_API,
      auth0Token: 'fake token',
      dexieInstance: getMockDexieInstanceAllSuccess(),
      isMermaidAuthenticated: true,
      isAppOnline: true,
    })
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('getUserProfile offline returns data from local storage', async () => {
  const userProfile = await getUserProfile({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance: getMockDexieInstanceAllSuccess(),
    isMermaidAuthenticated: true,
    isAppOnline: false,
  })

  expect(userProfile).toEqual({
    id: 'fake-id',
    first_name: 'FakeFirstNameOffline',
    last_name: 'FakeLastNameOffline',
    full_name: 'FakeFirstNameOffline FakeLastNameOffline',
  })
})
test('getUserProfile offline returns error message upon dexie error', async () => {
  expect.assertions(1)

  try {
    await getUserProfile({
      apiBaseUrl: process.env.REACT_APP_MERMAID_API,
      auth0Token: 'fake token',
      dexieInstance: getMockDexieInstanceThatProducesErrors(),
      isMermaidAuthenticated: true,
      isAppOnline: false,
    })
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
