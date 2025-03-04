import '@testing-library/jest-dom'
import React from 'react'

import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import Footer from '.'

test('Footer component shows help, terms, contact, credits links when online', () => {
  renderAuthenticatedOnline(<Footer />)

  const helpButton = screen.getByText(/Help \(PDF\) ▲/i)

  const termsLink = screen.getByRole('link', {
    name: /terms/i,
  })
  const contactLink = screen.getByRole('link', {
    name: /contact/i,
  })
  const creditsLink = screen.getByRole('link', {
    name: /credits/i,
  })

  expect(helpButton).toBeInTheDocument()
  expect(termsLink).toBeInTheDocument()
  expect(contactLink).toBeInTheDocument()
  expect(creditsLink).toBeInTheDocument()
})
test('Footer component shows help, and hide terms, contact, credits links when offline', async () => {
  renderAuthenticatedOffline(<Footer />)

  const helpButton = screen.getByText(/Help \(PDF\) ▲/i)

  const termsLink = screen.queryByRole('link', {
    name: /terms/i,
  })
  const contactLink = screen.queryByRole('link', {
    name: /contact/i,
  })
  const creditsLink = screen.queryByRole('link', {
    name: /credits/i,
  })

  await waitFor(() => {
    expect(helpButton).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(termsLink).not.toBeInTheDocument()
  })
  await waitFor(() => {
    expect(contactLink).not.toBeInTheDocument()
  })
  await waitFor(() => {
    expect(creditsLink).not.toBeInTheDocument()
  })
})
