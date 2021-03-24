import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../testUtilities/testingLibraryWithHelpers'

import OfflineBorders from './OfflineBorders'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('OfflineBorders component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<OfflineBorders />)

  expect(screen.getByText('I should fail'))
})
