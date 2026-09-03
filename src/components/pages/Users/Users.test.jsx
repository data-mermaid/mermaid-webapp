import { expect, test } from 'vitest'
import '@testing-library/jest-dom'

import React from 'react'
import { Route, Routes } from 'react-router'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'

import Users from './Users'

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
    <Routes>
      <Route path="/projects/:projectId/users" element={<Users />} />
    </Routes>,
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
