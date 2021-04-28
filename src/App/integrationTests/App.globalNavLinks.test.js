import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  within,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('App renders shows projects, reports, reference, and global dashboard links in Global Nav Links when online', async () => {
  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const globalNavLinks = screen.getByTestId('global-nav')

  const projectsLink = within(globalNavLinks).getByRole('link', {
    name: /projects/i,
  })
  const reportsLink = within(globalNavLinks).getByRole('link', {
    name: /reports/i,
  })
  const reference = within(globalNavLinks).getByRole('link', {
    name: /reference/i,
  })
  const globalDashboardLink = within(globalNavLinks).getByRole('link', {
    name: /global dashboard/i,
  })

  expect(projectsLink).toBeInTheDocument()
  expect(reportsLink).toBeInTheDocument()
  expect(reference).toBeInTheDocument()
  expect(globalDashboardLink).toBeInTheDocument()
})

test('App renders shows projects, reference links in Global Nav Links when offline', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const globalNavLinks = screen.getByTestId('global-nav')

  const projectsLink = within(globalNavLinks).getByRole('link', {
    name: /projects/i,
  })

  expect(projectsLink).toBeInTheDocument()

  const reportsLink = within(globalNavLinks).queryByRole('link', {
    name: /reports/i,
  })

  await waitFor(() => {
    expect(reportsLink).not.toBeInTheDocument()
  })

  const reference = within(globalNavLinks).getByRole('link', {
    name: /reference/i,
  })

  expect(reference).toBeInTheDocument()

  const globalDashboardLink = within(globalNavLinks).queryByRole('link', {
    name: /global dashboard/i,
  })

  await waitFor(() => {
    expect(globalDashboardLink).not.toBeInTheDocument()
  })
})
