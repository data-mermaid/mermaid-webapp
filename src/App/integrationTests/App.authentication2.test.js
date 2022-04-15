import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'

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
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOffline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    { dexieCurrentUserInstance, dexiePerUserDataInstance },
  )

  expect(await screen.findByText('Projects', { selector: 'h1' }))

  fireEvent.click(screen.getByText('FakeFirstNameOffline'))

  // there is not a logout button

  await waitFor(() => expect(screen.queryByText('Logout')).not.toBeInTheDocument())
})

test('App renders the initial screen as expected for an online but not authenticated user', () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderUnauthenticatedOnline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    { dexieCurrentUserInstance, dexiePerUserDataInstance },
  )

  expect(screen.queryByRole('heading', { name: 'Projects' })).not.toBeInTheDocument()
})

test('App renders the initial screen as expected for an offline user who is not authenticated in an online environment', () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderUnauthenticatedOffline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    { dexieCurrentUserInstance, dexiePerUserDataInstance },
  )

  expect(screen.queryByRole('heading', { name: 'Projects' })).not.toBeInTheDocument()
})
