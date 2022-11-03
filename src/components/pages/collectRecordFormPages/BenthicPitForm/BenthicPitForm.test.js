import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import BenthicPitForm from './BenthicPitForm'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('BenthicPitForm component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<BenthicPitForm />)

  expect(screen.getByText('I should fail'))
})
