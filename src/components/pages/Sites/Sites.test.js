import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Route } from 'react-router-dom'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'

import Sites from './Sites'

test('Site component renders with the expected headers', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites">
      <Sites />
    </Route>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
    },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[0]).getByText('Name'))
  expect(within(tableRows[0]).getByText('Reef Type'))
  expect(within(tableRows[0]).getByText('Reef Zone'))
  expect(within(tableRows[0]).getByText('Exposure'))
})

test('Site Records table sorts properly by Name column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites">
      <Sites />
    </Route>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
    },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Site A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Name'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Site A'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Name'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Site D'))
})

test('Site Records table sorts properly by Reef Type column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites">
      <Sites />
    </Route>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
    },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('fringing'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Reef Type'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('atoll'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Reef Type'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('lagoon'))
})

test('Site Records table sorts properly by Reef Zone column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites">
      <Sites />
    </Route>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
    },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('fore reef'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Reef Zone'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('back reef'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Reef Zone'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('pinnacle'))
})

test('Site Records table sorts properly by Exposure column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites">
      <Sites />
    </Route>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/sites'],
    },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('exposed'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Exposure'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('exposed'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Exposure'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('very sheltered'))
})
