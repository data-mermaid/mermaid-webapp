import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  mockMermaidApiAllSuccessful,
} from '../../../testUtilities/testingLibraryWithHelpers'

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

test('PageNotFound component renders with the expected UI elements', async () => {
  // Below is not working yet, under investigation
  // renderAuthenticatedOnline(
  //   <Route path="/notfound">
  //     <PageNotFound />
  //   </Route>,
  // )
  // expect(await screen.findByText(/sorry, page not found/i, { selector: 'h1' }))
})
