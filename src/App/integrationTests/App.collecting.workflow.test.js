import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Collecting workflow shows proper nav when routing for sites page', () => {
  renderAuthenticatedOnline(<App />)
  fireEvent.click(screen.getAllByLabelText('Collect')[0])
  fireEvent.click(screen.getByText('Sites'))

  expect(screen.getByText('Sites Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Collecting'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  // expect(within(main).queryByText('Submitted')).toBeNull()
  // expect(within(main).queryByText('Graphs and Maps')).toBeNull()
})

test('Collecting workflow shows proper nav when routing for management regimes page', () => {
  renderAuthenticatedOnline(<App />)
  fireEvent.click(screen.getAllByLabelText('Collect')[0])
  fireEvent.click(screen.getByText('Management Regimes'))

  expect(screen.getByText('Management Regimes Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Collecting'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  // expect(within(main).queryByText('Submitted')).toBeNull()
  // expect(within(main).queryByText('Graphs and Maps')).toBeNull()
})
test('Collecting workflow shows proper nav when routing for collecting page', () => {
  renderAuthenticatedOnline(<App />)
  fireEvent.click(screen.getAllByLabelText('Collect')[0])

  expect(screen.getByText('Collect Table Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Collecting'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  // expect(within(main).queryByText('Submitted')).toBeNull()
  // expect(within(main).queryByText('Graphs and Maps')).toBeNull()
})
