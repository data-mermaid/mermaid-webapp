import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticated,
  renderUnauthenticated,
  screen,
} from './testUtilities/testingLibraryWithHelpers'
import App from './App'

test('App renders the initial screen as expected for a authenticated user', () => {
  renderAuthenticated(<App />)

  expect(screen.getByRole('heading')).toHaveTextContent('Projects')
})

test('App renders the initial screen as expected for a not authenticated user', () => {
  renderUnauthenticated(<App />)

  expect(screen.queryByText('Projects')).toBeNull()
})
