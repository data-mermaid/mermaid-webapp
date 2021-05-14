import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../testUtilities/testingLibraryWithHelpers'

import CollectRecordsCount from './CollectRecordsCount'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('CollectRecordsCount component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<CollectRecordsCount />)

  expect(screen.getByText('I should fail'))
})
