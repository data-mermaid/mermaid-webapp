import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'

import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

// test suite cut up into 2 parts for performance reasons

test('App renders the initial screen as expected for an online and authenticated user', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    { dexiePerUserDataInstance, dexieCurrentUserInstance },
  )

  expect(await screen.findByText('Projects', { selector: 'h1' }))

  fireEvent.click(screen.getByText('FakeFirstNameOnline'))

  // there is a logout button
  expect(screen.getByText('Logout'))
})

test('App: an online and authenticated user can logout', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    { dexieCurrentUserInstance, dexiePerUserDataInstance },
  )

  fireEvent.click(await screen.findByText('FakeFirstNameOnline'))
  fireEvent.click(screen.getByText('Logout'))
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: 'Projects' })).not.toBeInTheDocument(),
  )
})
