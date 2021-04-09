import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Route } from 'react-router-dom'
import {
  screen,
  renderAuthenticatedOnline,
  mockMermaidApiAllSuccessful,
} from '../../testUtilities/testingLibraryWithHelpers'
import PageNotFound from '../../components/pages/PageNotFound'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('App renders shows page not found when navigate to unknown path.', () => {
  renderAuthenticatedOnline(
    <Route>
      <PageNotFound />
    </Route>,
    { initialEntries: ['/thisRouteDoesNotExist'] },
  )

  expect(
    screen.getByText(/sorry page not found/i, {
      selector: 'h1',
    }),
  )
})
