import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { Route, Routes } from 'react-router'
import { http, HttpResponse } from 'msw'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import GfcrIndicatorSet from './GfcrIndicatorSet'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// fakeCurrentUser in testingLibraryWithHelpers is an admin of this project
const projectId = 'fake-project-id'

const indicatorSet = {
  id: 'set-1',
  title: 'Alpha set',
  indicator_set_type: 'report',
  report_date: '2026-02-10',
  finance_solutions: [],
}

// Coming from the GFCR list, the indicator sets are already in context before this page loads
vi.mock('../../../../App/CurrentProjectContext', async (importOriginal) => ({
  ...(await importOriginal()),
  useCurrentProject: () => ({ gfcrIndicatorSets: [indicatorSet], setGfcrIndicatorSets: () => {} }),
}))

test('An indicator set whose choices fail to load says so instead of crashing', async () => {
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/projects/${projectId}/indicatorsets/`, () =>
      HttpResponse.json({ count: 1, next: null, results: [indicatorSet] }),
    ),
  )

  // The mock offline storage has no choices, so loading them fails
  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/gfcr/:indicatorSetId" element={<GfcrIndicatorSet />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: [`/projects/${projectId}/gfcr/${indicatorSet.id}`],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  expect(screen.getByText('gfcr.errors.indicator_sets_unavailable')).toBeInTheDocument()

  await user.click(screen.getByText('gfcr.businesses_finance_solutions'))

  // A crash replaces the whole page, nav included
  expect(screen.getByText('gfcr.businesses_finance_solutions')).toBeInTheDocument()
  expect(screen.getByText('gfcr.errors.indicator_sets_unavailable')).toBeInTheDocument()
  expect(screen.queryByText('gfcr.forms.finance_solutions.add')).not.toBeInTheDocument()
})
