import React from 'react'
import {
  renderAuthenticated,
  renderUnauthenticated,
  screen,
} from './testUtilities/testingLibraryWithHelpers'
import App from './App'

test('App renders the initial screen as expected for a authenticated user', () => {
  renderAuthenticated(<App />)

  // this assertion is for demo purposes only and will be deleted as the landing pages are built
  expect(screen.getByText('All projects page placeholder'))
})

test('App renders the initial screen as expected for a not authenticated user', () => {
  renderUnauthenticated(<App />)

  // this assertion is for demo purposes only and will be deleted as the landing pages are built
  expect(screen.queryByText('All projects page placeholder')).toBeNull()
})
