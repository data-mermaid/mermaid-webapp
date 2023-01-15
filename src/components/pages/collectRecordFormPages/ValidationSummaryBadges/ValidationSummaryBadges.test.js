import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import ValidationSummaryBadges from './ValidationSummaryBadges'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('ValidationSummaryBadges component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<ValidationSummaryBadges />)

  expect(screen.getByText('I should fail'))
})
