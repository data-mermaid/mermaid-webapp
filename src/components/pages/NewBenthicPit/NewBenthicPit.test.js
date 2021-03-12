import '@testing-library/jest-dom/extend-expect'
// import React from 'react'
import {
  // renderAuthenticatedOnline,
  // screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

// import NewBenthicPit from './NewBenthicPit'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('NewBenthicPit component renders with the expected UI elements', () => {
  // renderAuthenticatedOnline(<NewBenthicPit />)
  // expect(screen.getByText('I should fail'))
})
