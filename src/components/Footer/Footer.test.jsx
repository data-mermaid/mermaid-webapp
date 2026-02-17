import { expect, test } from 'vitest'
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

  const helpButton = screen.getByTestId('help-documents-dropdown')
  const termsLink = screen.getByTestId('terms-link')
  const contactLink = screen.getByTestId('contact-link')
  const creditsLink = screen.getByTestId('credits-link')

  expect(helpButton).toBeInTheDocument()
  expect(termsLink).toBeInTheDocument()
  expect(contactLink).toBeInTheDocument()
  expect(creditsLink).toBeInTheDocument()
})
test('Footer component shows help, and hide terms, contact, credits links when offline', async () => {
  renderAuthenticatedOffline(<Footer />)

  const helpButton = screen.getByTestId('help-documents-dropdown')
  const termsLink = screen.queryByTestId('terms-link')
  const contactLink = screen.queryByTestId('contact-link')
  const creditsLink = screen.queryByTestId('credits-link')

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
