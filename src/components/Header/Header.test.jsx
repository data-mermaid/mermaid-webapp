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
const mermaidExploreLink = import.meta.env.VITE_MERMAID_EXPLORE_LINK

test('Header component shows projects, reference, and global dashboard links and their proper href links when online', () => {
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

  const mermaidExploreHeader = screen.getByRole('link', {
    name: /mermaid explore/i,
  })

  expect(mermaidExploreHeader).toBeInTheDocument()
  expect(mermaidExploreHeader).toHaveAttribute('href', mermaidExploreLink)
})
test('Header component shows projects, reference; hides global dashboard links when offline', async () => {
  renderAuthenticatedOffline(<Header />)

  const projectsLink = screen.getByRole('link', {
    name: /projects/i,
  })

  const reference = screen.getByRole('link', {
    name: /reference/i,
  })

  expect(reference).toHaveAttribute('href', `${mermaidReferenceLink}`)

  const mermaidExploreHeader = screen.queryByRole('link', {
    name: /mermaid explore/i,
  })

  expect(projectsLink).toBeInTheDocument()
  expect(reference).toBeInTheDocument()
  await waitFor(() => {
    expect(mermaidExploreHeader).not.toBeInTheDocument()
  })
})
