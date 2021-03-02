import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import mockMermaidDbAccessInstance from '../../testUtilities/mockMermaidDbAccessInstance'
import {
  fireEvent,
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

beforeAll(() => mockMermaidApiAllSuccessful.listen())
afterEach(() => mockMermaidApiAllSuccessful.resetHandlers())
afterAll(() => mockMermaidApiAllSuccessful.close())

test('App renders the initial screen as expected for an online and authenticated user', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getByText('FakeFirstNameOnline'))

  // there is a logout button
  expect(screen.getByText('Logout'))
})

test('App: an online and authenticated user can logout', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  fireEvent.click(await screen.findByText('FakeFirstNameOnline'))
  fireEvent.click(screen.getByText('Logout'))
  await waitFor(() => expect(screen.queryByText('Projects')).toBeNull())
})

test('App renders the initial screen as expected for an offline user who is authenticated when online', async () => {
  renderAuthenticatedOffline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  expect(await screen.findByText('Projects', { selector: 'h1' }))

  fireEvent.click(screen.getByText('FakeFirstNameOnline'))

  // there is not a logout button
  expect(await waitFor(() => screen.queryByText('Logout'))).toBeNull()
})

test('App renders the initial screen as expected for an online but not authenticated user', () => {
  renderUnauthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  expect(screen.queryByText('Projects')).toBeNull()
})

test('App renders the initial screen as expected for an offline user who is not authenticated in an online environment', () => {
  renderUnauthenticatedOffline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  expect(screen.queryByText('Projects')).toBeNull()
})
