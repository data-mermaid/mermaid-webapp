import '@testing-library/jest-dom'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'

import {
  renderAuthenticatedOffline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import userEvent from '@testing-library/user-event'
import App from '../App'

// test suite cut up into 2 parts for performance reasons
test('App renders the initial screen as expected for an offline user who is authenticated when online', async () => {
  const user = userEvent.setup()
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexieCurrentUserInstance,
    dexiePerUserDataInstance,
  })

  expect(screen.getByTestId('projects-link')).toBeInTheDocument()

  await user.click(await screen.findByText('FF')) // user icon initials for offline user

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
