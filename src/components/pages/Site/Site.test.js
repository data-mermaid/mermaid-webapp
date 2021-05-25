import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../testUtilities/testingLibraryWithHelpers'

import Site from './Site'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('Site component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<Site />)

  expect(screen.getByText('I should fail'))
})
