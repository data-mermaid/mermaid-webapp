import { afterEach, expect, test, vi } from 'vitest'
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

// Lets a test stand in for the moment before the per-user database exists, which the render
// helpers can't do because they always supply one.
const perUserData = vi.hoisted(() => ({ isMissing: false }))

vi.mock('../dexiePerUserDataInstanceContext', async (importOriginal) => {
  const original = await importOriginal()

  return {
    ...original,
    useDexiePerUserDataInstance: (args) => {
      const context = original.useDexiePerUserDataInstance(args)

      return perUserData.isMissing ? { ...context, dexiePerUserDataInstance: undefined } : context
    },
  }
})

afterEach(() => {
  perUserData.isMissing = false
})

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
  // Logging out closes the Dexie DB; suppress the expected DatabaseClosedError that
  // fires when async operations attempt to use it after close
  vi.spyOn(console, 'error').mockImplementation(() => {})

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexieCurrentUserInstance,
    dexiePerUserDataInstance,
  })

  fireEvent.click(await screen.findByText('WW')) // user icon initials for online user
  fireEvent.click(screen.getByTestId('logout-button'))

  await waitFor(() => expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument())
})

test('App: a user can logout before their offline data has loaded', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  perUserData.isMissing = true

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
  // The menu closes whether or not logout worked, so check the user's data was cleared instead
  const deleteCurrentUserData = vi.spyOn(dexieCurrentUserInstance, 'delete')

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexieCurrentUserInstance,
    dexiePerUserDataInstance,
  })

  fireEvent.click(await screen.findByText('WW')) // user icon initials for online user
  fireEvent.click(screen.getByTestId('logout-button'))

  await waitFor(() => expect(deleteCurrentUserData).toHaveBeenCalled())
})
