import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

import ButtonSecondaryDropdown from './ButtonSecondaryDropdown'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('ButtonSecondaryDropdown component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<ButtonSecondaryDropdown />)

  expect(screen.getByText('I should fail'))
})
