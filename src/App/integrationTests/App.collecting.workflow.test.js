import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import mockMermaidDbAccessInstance from '../../testUtilities/mockMermaidDbAccessInstance'

import {
  fireEvent,
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

beforeAll(() => mockMermaidApiAllSuccessful.listen())
afterEach(() => mockMermaidApiAllSuccessful.resetHandlers())
afterAll(() => mockMermaidApiAllSuccessful.close())

test('Collecting workflow shows proper nav when routing for sites page', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )
  // we dont have loading indicators built yet, so we wait for the heading to show up.
  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getAllByLabelText('Collect')[0])
  fireEvent.click(screen.getByText('Sites'))

  expect(screen.getByText('Sites Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Collecting'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  expect(within(main).queryByText('Submitted')).toBeNull()
  expect(within(main).queryByText('Graphs and Maps')).toBeNull()
})

test('Collecting workflow shows proper nav when routing for management regimes page', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )
  // we dont have loading indicators built yet, so we wait for the heading to show up.
  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getAllByLabelText('Collect')[0])
  fireEvent.click(screen.getByText('Management Regimes'))

  expect(screen.getByText('Management Regimes Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Collecting'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  expect(within(main).queryByText('Submitted')).toBeNull()
  expect(within(main).queryByText('Graphs and Maps')).toBeNull()
})
test('Collecting workflow shows proper nav when routing for collecting page', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  // we dont have loading indicators built yet, so we wait for the heading to show up.
  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')
  fireEvent.click(screen.getAllByLabelText('Collect')[0])

  expect(screen.getByText('Collect Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Collecting'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  expect(within(main).queryByText('Submitted')).toBeNull()
  expect(within(main).queryByText('Graphs and Maps')).toBeNull()
})
