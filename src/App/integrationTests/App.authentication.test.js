import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import mockMermaidDbAccessInstance from '../../library/apiServices/mockMermaidDbAccessInstance'
import {
  fireEvent,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  renderUnauthenticatedOffline,
  renderUnauthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

const server = setupServer(
  rest.get(`${process.env.REACT_APP_MERMAID_API}/me`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'fake-id',
        first_name: 'FakeFirstNameOnline',
        last_name: 'FakeLastName',
        full_name: 'FakeFirstName FakeLastName',
        email: 'fake@email.com',
        created_on: '2020-10-16T15:27:30.555961Z',
        updated_on: '2020-10-16T15:27:30.569938Z',
      }),
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

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
