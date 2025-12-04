import '@testing-library/jest-dom'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'

import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

// test suite cut up into 2 parts for performance reasons

test('App renders the initial screen as expected for an online and authenticated user', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(screen.getByTestId('projects-link')).toBeInTheDocument()

  fireEvent.click(await screen.findByText('WW')) // user icon initials for online user

  // there is a logout button
  expect(screen.getByTestId('logout-button')).toBeInTheDocument()
})

test('App: an online and authenticated user can logout', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexieCurrentUserInstance,
    dexiePerUserDataInstance,
  })

  fireEvent.click(await screen.findByText('WW')) // user icon initials for online user
  fireEvent.click(screen.getByTestId('logout-button'))

  await waitFor(() => expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument())
})
