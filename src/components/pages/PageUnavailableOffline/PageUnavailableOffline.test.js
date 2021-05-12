import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

import PageUnavailableOffline from './PageUnavailableOffline'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('PageUnavailableOffline component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<PageUnavailableOffline />)

  expect(screen.getByText('I should fail'))
})
