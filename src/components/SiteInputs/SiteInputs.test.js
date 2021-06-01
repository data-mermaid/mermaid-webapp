import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../testUtilities/testingLibraryWithHelpers'

import SiteInputs from './SiteInputs'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('SiteInputs component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<SiteInputs />)

  expect(screen.getByText('I should fail'))
})
