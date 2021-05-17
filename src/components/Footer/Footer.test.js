import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import Footer from '.'

test('Footer component shows help, terms, contact, changelog, credits links when online', () => {
  renderAuthenticatedOnline(<Footer />)

  const helpLink = screen.getByRole('link', {
    name: /help/i,
  })

  const termsLink = screen.getByRole('link', {
    name: /terms/i,
  })
  const contactLink = screen.getByRole('link', {
    name: /contact/i,
  })
  const changelogLink = screen.getByRole('link', {
    name: /changelog/i,
  })
  const creditsLink = screen.getByRole('link', {
    name: /credits/i,
  })

  expect(helpLink).toBeInTheDocument()
  expect(termsLink).toBeInTheDocument()
  expect(contactLink).toBeInTheDocument()
  expect(changelogLink).toBeInTheDocument()
  expect(creditsLink).toBeInTheDocument()
})
test('Footer component shows help, and hide terms, contact, changelog, credits links when offline', async () => {
  renderAuthenticatedOffline(<Footer />)

  const helpLink = screen.getByRole('link', {
    name: /help/i,
  })

  const termsLink = screen.queryByRole('link', {
    name: /terms/i,
  })
  const contactLink = screen.queryByRole('link', {
    name: /contact/i,
  })
  const changelogLink = screen.queryByRole('link', {
    name: /changelog/i,
  })
  const creditsLink = screen.queryByRole('link', {
    name: /credits/i,
  })

  expect(helpLink).toBeInTheDocument()
  await waitFor(() => {
    expect(termsLink).not.toBeInTheDocument()
  })
  await waitFor(() => {
    expect(contactLink).not.toBeInTheDocument()
  })
  await waitFor(() => {
    expect(changelogLink).not.toBeInTheDocument()
  })
  await waitFor(() => {
    expect(creditsLink).not.toBeInTheDocument()
  })
})
