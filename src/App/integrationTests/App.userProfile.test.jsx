import '@testing-library/jest-dom'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('App renders shows the users name from the API for an online and authenticated user', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // wait for page to load in lieu of being able to test for a loading indicator to have vanished
  expect(await screen.findByText('Projects', { selector: 'h1' }))

  await waitFor(() => expect(screen.queryByText('FF')).not.toBeInTheDocument()) // user icon initials for offline user

  expect(await screen.findByText('WW')) // user icon initials for online user
})

test('App renders shows the users name from offline storage for an offline user who is authenticated when online', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  // wait for page to load in lieu of being able to test for a loading indicator to have vanished
  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )
  await waitFor(() => expect(screen.queryByText('WW')).not.toBeInTheDocument()) // user icon initials for online user
  expect(await screen.findByText('FF')) // user icon initials for offline user
})
