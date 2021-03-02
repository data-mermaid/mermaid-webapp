import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import mockMermaidDbAccessInstance from '../../library/apiServices/mockMermaidDbAccessInstance'
import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
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

test('Data workflow shows proper nav when routing for sites page', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  // we dont have loading indicators built yet, so we wait for the heading to show up.
  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getAllByLabelText('Data')[0])
  fireEvent.click(screen.getByText('Sites'))

  expect(screen.getByText('Sites Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  expect(within(main).queryByText('Collecting')).toBeNull()
})

test('Data workflow shows proper nav when routing for management and regimes page', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )
  // we dont have loading indicators built yet, so we wait for the heading to show up.
  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getAllByLabelText('Data')[0])
  fireEvent.click(screen.getByText('Management Regimes'))

  expect(screen.getByText('Management Regimes Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  expect(within(main).queryByText('Collecting')).toBeNull()
})

test('Data workflow shows proper nav when routing for data/submitted page', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  // we dont have loading indicators built yet, so we wait for the heading to show up.
  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getAllByLabelText('Data')[0])

  expect(screen.getByText('Data Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  expect(within(main).queryByText('Collecting')).toBeNull()
})

test('Data workflow shows proper nav when routing graphs and maps page', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={mockMermaidDbAccessInstance} />,
  )

  // we dont have loading indicators built yet, so we wait for the heading to show up.
  expect(await screen.findByRole('heading')).toHaveTextContent('Projects')

  fireEvent.click(screen.getAllByLabelText('Data')[0])
  fireEvent.click(screen.getByText('Graphs and Maps'))

  expect(screen.getByText('Graphs and Maps Placeholder'))

  // use main to limit selection scope to avoid the nav links in the breadcrumbs
  const main = screen.getByRole('main')

  expect(within(main).getByText('Submitted'))
  expect(within(main).getByText('Graphs and Maps'))
  expect(within(main).getByText('Sites'))
  expect(within(main).getByText('Management Regimes'))

  expect(within(main).queryByText('Collecting')).toBeNull()
})
