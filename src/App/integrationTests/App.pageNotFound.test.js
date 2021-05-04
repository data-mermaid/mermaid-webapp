import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Route } from 'react-router-dom'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  screen,
  renderAuthenticatedOnline,
  mockMermaidApiAllSuccessful,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('App renders shows page not found when navigate to unknown path.', async () => {
  renderAuthenticatedOnline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/thisRouteDoesNotExist'] },
  )

  expect(await screen.findByText(/sorry, page not found/i))
})
