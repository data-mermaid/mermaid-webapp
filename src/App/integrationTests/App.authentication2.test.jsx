import '@testing-library/jest-dom'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'

import {
  fireEvent,
  renderAuthenticatedOffline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

// test suite cut up into 2 parts for performance reasons

test('App renders the initial screen as expected for an offline user who is authenticated when online', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexieCurrentUserInstance,
    dexiePerUserDataInstance,
  })

  expect(await screen.findByText('Projects', { selector: 'h1' }))

  fireEvent.click(screen.getByText('FF')) // user icon initials for offline user

  // there is not a logout button

  await waitFor(() => expect(screen.queryByText('Logout')).not.toBeInTheDocument())
})

test('App renders the initial screen as expected for an online but not authenticated user', () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderUnauthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexieCurrentUserInstance,
    dexiePerUserDataInstance,
  })

  expect(screen.queryByRole('heading', { name: 'Projects' })).not.toBeInTheDocument()
})

test('App renders the initial screen as expected for an offline user who is not authenticated in an online environment', () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderUnauthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexieCurrentUserInstance,
    dexiePerUserDataInstance,
  })

  expect(screen.queryByRole('heading', { name: 'Projects' })).not.toBeInTheDocument()
})
