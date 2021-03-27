import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import getMockDexieInstance from '../../testUtilities/getMockDexieInstance'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
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

test('App renders shows the users name from the API for an online and authenticated user', async () => {
  renderAuthenticatedOnline(<App dexieInstance={getMockDexieInstance()} />)

  // wait for page to load in lieu of being able to test for a loading indicator to have vanished
  expect(await screen.findByText('Projects', { selector: 'h1' }))

  await waitFor(() =>
    expect(screen.queryByText('FakeFirstNameOffline')).toBeNull(),
  )
  expect(await screen.findByText('FakeFirstNameOnline'))
})

test('App renders shows the users name from offline storage for an offline user who is authenticated when online', async () => {
  const thing = renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstance()} />,
  )

  // wait for page to load in lieu of being able to test for a loading indicator to have vanished
  expect(
    await thing.findByText('Projects', {
      selector: 'h1',
    }),
  )
  await waitFor(() =>
    expect(thing.queryByText('FakeFirstNameOnline')).toBeNull(),
  )
  expect(await thing.findByText('FakeFirstNameOffline'))
})
