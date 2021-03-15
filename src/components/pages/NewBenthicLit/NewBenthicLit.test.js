import '@testing-library/jest-dom/extend-expect'
// import React from 'react'
import {
  // renderAuthenticatedOnline,
  // screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

// import NewBenthicLit from './NewBenthicLit'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('NewBenthicLit component renders with the expected UI elements', () => {
  // renderAuthenticatedOnline(<NewBenthicLit />)
  // expect(screen.getByText('I should fail'))
})
