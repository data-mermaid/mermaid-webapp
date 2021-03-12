import '@testing-library/jest-dom/extend-expect'
// import React from 'react'
import {
  // renderAuthenticatedOnline,
  // screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

// import NewBleaching from './NewBleaching'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('NewBleaching component renders with the expected UI elements', () => {
  // renderAuthenticatedOnline(<NewBleaching />)
  // expect(screen.getByText('I should fail'))
})
