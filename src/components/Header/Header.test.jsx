import '@testing-library/jest-dom'
import React from 'react'

import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import Header from '.'

const mermaidReferenceLink = import.meta.env.VITE_MERMAID_REFERENCE_LINK
const mermaidDashboardLink = import.meta.env.VITE_MERMAID_DASHBOARD_LINK

test('Header component shows projects, whats new, reference, and global dashboard links and their proper href links when online', () => {
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
  expect(reference).toHaveAttribute('href', expect.stringContaining(`${mermaidReferenceLink}`))

  const whatsNewLink = screen.queryByText("What's new")

  expect(whatsNewLink).toBeInTheDocument()

  const globalDashboardLink = screen.getByRole('link', {
    name: /global dashboard/i,
  })

  expect(globalDashboardLink).toBeInTheDocument()
  expect(globalDashboardLink).toHaveAttribute('href', mermaidDashboardLink)
})
test('Header component shows projects, reference; and hide whats new, global dashboard links when offline', async () => {
  renderAuthenticatedOffline(<Header />)

  const projectsLink = screen.getByRole('link', {
    name: /projects/i,
  })

  const whatsNewLink = screen.queryByText(/What&pos;s new/i)
  const reference = screen.getByRole('link', {
    name: /reference/i,
  })

  expect(reference).toHaveAttribute('href', `${mermaidReferenceLink}`)

  const globalDashboardLink = screen.queryByRole('link', {
    name: /global dashboard/i,
  })

  expect(projectsLink).toBeInTheDocument()
  await waitFor(() => {
    expect(whatsNewLink).not.toBeInTheDocument()
  })
  expect(reference).toBeInTheDocument()
  await waitFor(() => {
    expect(globalDashboardLink).not.toBeInTheDocument()
  })
})
