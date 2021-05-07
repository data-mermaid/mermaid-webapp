import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import Header from '.'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('Header component shows projects, reports, reference, and global dashboard links when online', () => {
  renderAuthenticatedOnline(<Header />)

  const projectsLink = screen.getByRole('link', {
    name: /projects/i,
  })

  const reportsLink = screen.getByRole('link', {
    name: /reports/i,
  })
  const reference = screen.getByRole('link', {
    name: /reference/i,
  })
  const globalDashboardLink = screen.getByRole('link', {
    name: /global dashboard/i,
  })

  expect(projectsLink).toBeInTheDocument()
  expect(reportsLink).toBeInTheDocument()
  expect(reference).toBeInTheDocument()
  expect(globalDashboardLink).toBeInTheDocument()
})
test('Header component shows projects, reference; and hide reports, global dashboard links when offline', async () => {
  renderAuthenticatedOffline(<Header />)

  const projectsLink = screen.getByRole('link', {
    name: /projects/i,
  })

  const reportsLink = screen.queryByRole('link', {
    name: /reports/i,
  })
  const reference = screen.getByRole('link', {
    name: /reference/i,
  })
  const globalDashboardLink = screen.queryByRole('link', {
    name: /global dashboard/i,
  })

  expect(projectsLink).toBeInTheDocument()
  await waitFor(() => {
    expect(reportsLink).not.toBeInTheDocument()
  })
  expect(reference).toBeInTheDocument()
  await waitFor(() => {
    expect(globalDashboardLink).not.toBeInTheDocument()
  })
})
