import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('App renders the initial screen as expected for an online and authenticated user', () => {
  renderAuthenticatedOnline(<App />)

  expect(screen.getByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getByText('Fake User'))

  // there is a logout button
  expect(screen.getByText('Logout'))
})
test('App renders the initial screen as expected for an offline user who is authenticated when online', () => {
  renderAuthenticatedOffline(<App />)

  expect(screen.getByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getByText('Fake User'))

  // there is not a logout button
  expect(screen.queryByText('Logout')).toBeNull()
})

test('App renders the initial screen as expected for an online but not authenticated user', () => {
  renderUnauthenticatedOnline(<App />)

  expect(screen.queryByText('Projects')).toBeNull()
})

test('App renders the initial screen as expected for an offline user who is not authenticated in an online environment', () => {
  renderUnauthenticatedOffline(<App />)

  expect(screen.queryByText('Projects')).toBeNull()
})
