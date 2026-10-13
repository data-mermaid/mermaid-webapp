import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'

import React from 'react'
import { Route, Routes } from 'react-router'
import { http, HttpResponse } from 'msw'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { HttpResponseErrorHandlerProvider } from '../../../App/HttpResponseErrorHandlerContext'
import handleHttpResponseError from '../../../library/handleHttpResponseError'

import Users from './Users'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// Dexie returns records in primary-key order, and the shared mock's ids happen to land the
// project 5 profiles alphabetically, which would hide the bug this test exists for. Reseed them
// deliberately out of order so a broken comparator produces a visibly wrong table.
const UNSORTED_PROFILE_NAMES = [
  'Zoe Fisher',
  'Al Leonard',
  'Melissa Nunes',
  'Bruno Adams',
  'Nick Hoang',
]

const EXPECTED_ASCENDING = [
  'Al Leonard',
  'Bruno Adams',
  'Melissa Nunes',
  'Nick Hoang',
  'Zoe Fisher',
]

const seedUnsortedProfiles = async (dexiePerUserDataInstance) => {
  const [template] = await dexiePerUserDataInstance.project_profiles.toArray()

  await dexiePerUserDataInstance.project_profiles.clear()
  await dexiePerUserDataInstance.project_profiles.bulkPut(
    UNSORTED_PROFILE_NAMES.map((profile_name, index) => ({
      ...template,
      id: `test-profile-${index}`,
      profile: `test-profile-${index}`,
      profile_name,
      project: '5',
      role: 90,
      num_active_sample_units: 0,
    })),
  )
}

const renderUsersPage = async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)
  await seedUnsortedProfiles(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    // The shared render helpers stub the handler out, so the page's error callbacks never run.
    // Supplying the real one is what lets a failed request be asserted on.
    <HttpResponseErrorHandlerProvider
      value={(config) => handleHttpResponseError({ ...config, logoutMermaid: () => {} })}
    >
      <Routes>
        <Route path="/projects/:projectId/users" element={<Users />} />
      </Routes>
    </HttpResponseErrorHandlerProvider>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/users'],
      dexiePerUserDataInstance,
      // the name cell that carries the bug only renders on the admin view of the table
      currentUserOverride: {
        id: 'fake-id',
        first_name: 'FakeFirstName',
        last_name: 'FakeLastName',
        projects: [{ id: '5', name: 'FakeProjectName', role: 90 }],
      },
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  return { user }
}

// The name cell renders an avatar of initials before the name, so drop that leading token.
const getNameColumnOrder = (table) =>
  within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole('cell')[0]
        .textContent.replace(/^[A-Z]+\s*/, '')
        .trim(),
    )

// The name cell is an avatar, a space, then the name, and the sort used to read the whitespace.
// Every row then compared as equal, so the table's default ascending sort did nothing and
// descending merely mirrored the original row order. See the M2076 QA follow-up.
test('Users table sorts by Name rather than falling back to row order', async () => {
  const { user } = await renderUsersPage()

  const table = screen.getByRole('table')
  const nameHeader = within(table).getAllByRole('columnheader')[0]

  // the table defaults to sorting by name ascending
  expect(getNameColumnOrder(table)).toEqual(EXPECTED_ASCENDING)

  await user.click(nameHeader)

  expect(getNameColumnOrder(table)).toEqual([...EXPECTED_ASCENDING].reverse())
})

// handleHttpResponseError invokes the caller's callback when a request gets no response at all,
// and error.response is undefined on that path. Reading .status off it threw before the callback
// could clear isTableUpdating, leaving the Add User button disabled until a reload.
test('Add User re-enables after a request that gets no server response', async () => {
  // handleHttpResponseError logs the axios error it is handling; keep it out of the test output
  vi.spyOn(console, 'error').mockImplementation(() => {})

  mockMermaidApiAllSuccessful.use(
    // a non-zero count routes the click to the add-existing-user path rather than the email prompt
    http.get(`${apiBaseUrl}/profiles/`, () => HttpResponse.json({ count: 1 })),
    http.post(`${apiBaseUrl}/projects/5/add_profile/`, () => HttpResponse.error()),
  )

  const { user } = await renderUsersPage()

  const addUserButton = screen.getByRole('button', { name: /buttons.add_user/ })

  await user.type(screen.getByLabelText('users.add_user_email'), 'existing.user@datamermaid.org')
  await user.click(addUserButton)

  await waitFor(() => expect(addUserButton).toBeEnabled())
})
