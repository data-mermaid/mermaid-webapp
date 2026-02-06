import { expect, test } from "vitest";
import '@testing-library/jest-dom'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'

import Sites from './Sites'

test('Site component renders with the expected headers', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites" element={<Sites />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  expect(screen.getByTestId('sites-table-header-name')).toHaveTextContent(/name/i)
  expect(screen.getByTestId('sites-table-header-reefType')).toHaveTextContent(/reef.?type/i)
  expect(screen.getByTestId('sites-table-header-reefZone')).toHaveTextContent(/reef.?zone/i)
  expect(screen.getByTestId('sites-table-header-exposure')).toHaveTextContent(/exposure/i)
})

test('Site Records table sorts properly by Name column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites" element={<Sites />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  const nameHeader = screen.getByTestId('sites-table-header-name')

  // click the Name column twice to disable default sorting
  await user.dblClick(nameHeader)

  expect(within(tableRows[1]).getByText('Site A'))

  // click once to change to ascending order
  await user.click(nameHeader)

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Site A'))

  // click again to change to descending order
  await user.click(nameHeader)

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Site D'))
})

test('Site Records table sorts properly by Reef Type column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites" element={<Sites />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  const nameHeader = screen.getByTestId('sites-table-header-name')

  // click the Name column twice to disable default sorting
  await user.dblClick(nameHeader)

  expect(within(tableRows[1]).getByText('fringing'))

  // click once to change to ascending order
  await user.click(screen.getByTestId('sites-table-header-reefType'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('atoll'))

  // click again to change to descending order
  await user.click(screen.getByTestId('sites-table-header-reefType'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('lagoon'))
})

test('Site Records table sorts properly by Reef Zone column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites" element={<Sites />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  const nameHeader = screen.getByTestId('sites-table-header-name')

  // click the Name column twice to disable default sorting
  await user.dblClick(nameHeader)

  expect(within(tableRows[1]).getByText('fore reef'))

  // click once to change to ascending order
  await user.click(screen.getByTestId('sites-table-header-reefZone'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('back reef'))

  // click again to change to descending order
  await user.click(screen.getByTestId('sites-table-header-reefZone'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('pinnacle'))
})

test('Site Records table sorts properly by Exposure column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites" element={<Sites />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('exposed'))

  const nameHeader = screen.getByTestId('sites-table-header-name')

  // click the Name column twice to disable default sorting
  await user.dblClick(nameHeader)

  // click once to change to ascending order
  await user.click(screen.getByTestId('sites-table-header-exposure'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('exposed'))

  // click again to change to descending order
  await user.click(screen.getByTestId('sites-table-header-exposure'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('very sheltered'))
})
