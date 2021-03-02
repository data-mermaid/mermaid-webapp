import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Data workflow shows proper nav when routing for sites page', () => {
  renderAuthenticatedOnline(<App />)
  fireEvent.click(screen.getAllByLabelText('Data')[0])
  fireEvent.click(screen.getByText('Sites'))

  expect(screen.getByText('Sites Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  // expect(within(main).queryByText('Collecting')).toBeNull()
})

test('Data workflow shows proper nav when routing for management and regimes page', () => {
  renderAuthenticatedOnline(<App />)
  fireEvent.click(screen.getAllByLabelText('Data')[0])
  fireEvent.click(screen.getByText('Management Regimes'))

  expect(screen.getByText('Management Regimes Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  // expect(within(main).queryByText('Collecting')).toBeNull()
})

test('Data workflow shows proper nav when routing for data/submitted page', () => {
  renderAuthenticatedOnline(<App />)
  fireEvent.click(screen.getAllByLabelText('Data')[0])

  expect(screen.getByText('Data Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  // expect(within(main).queryByText('Collecting')).toBeNull()
})

test('Data workflow shows proper nav when routing graphs and maps page', () => {
  renderAuthenticatedOnline(<App />)
  fireEvent.click(screen.getAllByLabelText('Data')[0])
  fireEvent.click(screen.getByText('Graphs and Maps'))

  expect(screen.getByText('Graphs and Maps Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  // expect(within(main).queryByText('Collecting')).toBeNull()
})
