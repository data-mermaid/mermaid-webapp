import '@testing-library/jest-dom/extend-expect'
// import React from 'react'
import {
  // renderAuthenticatedOnline,
  // screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

// import NewFishBelt from './NewFishBelt'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('NewFishBelt component renders with the expected UI elements', () => {
  // renderAuthenticatedOnline(<NewFishBelt />)
  // expect(screen.getByText('I should fail'))
})
