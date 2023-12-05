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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[0]).getByText('Name'))
  expect(within(tableRows[0]).getByText('Reef Type'))
  expect(within(tableRows[0]).getByText('Reef Zone'))
  expect(within(tableRows[0]).getByText('Exposure'))
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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Name column twice to disable default sorting
  await user.dblClick(within(table).getByText('Name'))

  expect(within(tableRows[1]).getByText('Site A'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Name'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Site A'))

  // click again to change to descending order
  await user.click(within(table).getByText('Name'))

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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Name column twice to disable default sorting
  await user.dblClick(within(table).getByText('Name'))

  expect(within(tableRows[1]).getByText('fringing'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Reef Type'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('atoll'))

  // click again to change to descending order
  await user.click(within(table).getByText('Reef Type'))

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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Name column twice to disable default sorting
  await user.dblClick(within(table).getByText('Name'))

  expect(within(tableRows[1]).getByText('fore reef'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Reef Zone'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('back reef'))

  // click again to change to descending order
  await user.click(within(table).getByText('Reef Zone'))

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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('exposed'))

  // click the Name column twice to disable default sorting
  await user.dblClick(within(table).getByText('Name'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Exposure'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('exposed'))

  // click again to change to descending order
  await user.click(within(table).getByText('Exposure'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('very sheltered'))
})
