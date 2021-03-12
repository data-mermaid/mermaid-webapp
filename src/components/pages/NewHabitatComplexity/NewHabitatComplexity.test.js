import '@testing-library/jest-dom/extend-expect'
// import React from 'react'
import {
  // renderAuthenticatedOnline,
  // screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

// import NewHabitatComplexity from './NewHabitatComplexity'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('NewHabitatComplexity component renders with the expected UI elements', () => {
  // renderAuthenticatedOnline(<NewHabitatComplexity />)
  // expect(screen.getByText('I should fail'))
})
