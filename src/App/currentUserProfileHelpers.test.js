import { rest } from 'msw'
import {
  getMockDexieInstancesAllSuccess,
  getMockDexieInstanceThatProducesErrors,
} from '../testUtilities/mockDexie'
import mockMermaidApiAllSuccessful from '../testUtilities/mockMermaidApiAllSuccessful'
import { getCurrentUserProfile } from './currentUserProfileHelpers'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API
const getAccessToken = async () => 'fake token'

test('getCurrentUserProfile online returns data from the API', async () => {
  const { dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
  const userProfile = await getCurrentUserProfile({
    apiBaseUrl,
    getAccessToken,
    dexieCurrentUserInstance,
    isMermaidAuthenticated: true,
    isAppOnline: true,
  })

  expect(userProfile).toEqual({
    id: 'fake-id',
    first_name: 'W-FakeFirstNameOnline',
    last_name: 'W-FakeLastNameOnline',
    full_name: 'W-FakeFirstNameOnline W-FakeLastNameOnline',
  })
})
test('getCurrentUserProfile online returns error message upon API error', async () => {
  const { dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.get(`${apiBaseUrl}/me`, (req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )

  expect.assertions(1)

  try {
    await getCurrentUserProfile({
      apiBaseUrl: process.env.REACT_APP_MERMAID_API,
      getAccessToken,
      dexieCurrentUserInstance,
      isMermaidAuthenticated: true,
      isAppOnline: true,
    })
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
test('getCurrentUserProfile offline returns data from local storage', async () => {
  const { dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const userProfile = await getCurrentUserProfile({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken,
    dexieCurrentUserInstance,
    isMermaidAuthenticated: true,
    isAppOnline: false,
  })

  expect(userProfile).toEqual({
    id: 'fake-id',
    first_name: 'FakeFirstNameOffline',
    last_name: 'FakeLastNameOffline',
    full_name: 'FakeFirstNameOffline FakeLastNameOffline',
    projects: [{ id: 'fake-project-id', name: 'FakeProjectName', role: 90 }],
  })
})
test('getCurrentUserProfile offline returns error message upon dexie error', async () => {
  expect.assertions(1)

  try {
    await getCurrentUserProfile({
      apiBaseUrl: process.env.REACT_APP_MERMAID_API,
      getAccessToken,
      dexieCurrentUserInstance: getMockDexieInstanceThatProducesErrors(),
      isMermaidAuthenticated: true,
      isAppOnline: false,
    })
  } catch (error) {
    expect(error.message).toBeTruthy()
  }
})
