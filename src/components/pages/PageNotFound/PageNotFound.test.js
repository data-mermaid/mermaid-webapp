import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../testUtilities/testingLibraryWithHelpers'

import PageNotFound from './PageNotFound'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('PageNotFound component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<PageNotFound />)

  expect(screen.getByText('I should fail'))
})
