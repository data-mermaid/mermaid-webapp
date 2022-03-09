import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import { mount } from 'react-router-dom'
import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  fireEvent,
} from '../../testUtilities/testingLibraryWithHelpers'
import Header from '.'

test('Header component shows projects, reports, reference, and global dashboard links and their proper href links when online', () => {
  renderAuthenticatedOnline(<Header />)

  const projectsLink = screen.getByRole('link', {
    name: /projects/i,
  })

  expect(projectsLink).toBeInTheDocument()
  expect(projectsLink).toHaveAttribute('href', '/projects')

  const reference = screen.getByRole('link', {
    name: /reference/i,
  })

  expect(reference).toBeInTheDocument()
  expect(reference).toHaveAttribute('href', 'https://dev-collect.datamermaid.org/#/reference/home')

  const reportsLink = screen.getByRole('link', {
    name: /reports/i,
  })

  expect(reportsLink).toBeInTheDocument()

  const globalDashboardLink = screen.getByRole('link', {
    name: /global dashboard/i,
  })

  expect(globalDashboardLink).toBeInTheDocument()
  expect(globalDashboardLink).toHaveAttribute('href', 'https://dashboard.datamermaid.org/')
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
