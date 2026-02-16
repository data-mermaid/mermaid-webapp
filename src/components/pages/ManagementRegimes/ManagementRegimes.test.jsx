import { expect, test } from 'vitest'
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

import ManagementRegimes from './ManagementRegimes'

test('ManagementRegimes component renders with the expected headers', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[0]).getByTestId('management-regime-header-name'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-estYear'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-compliance'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-openAccess'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-accessRestriction'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-periodicClosure'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-sizeLimits'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-gearRestriction'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-speciesRestriction'))
  expect(within(tableRows[0]).getByTestId('management-regime-header-noTake'))
})

test('Management Regime Records table sorts properly by Name column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-name'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-name'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by Year Est. column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('2021'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-estYear'))

  const tableRowsAfter = within(table).getAllByRole('row')

  // we test last row because it will have a non empty value which is easier to query
  expect(within(tableRowsAfter[3]).getByText('2021'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-estYear'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('2021'))
})

test('Management Regime Records table sorts properly by Compliance column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')
  // we test last row because it will have a non empty value which is easier to query

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[3]).getByText('somewhat'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-compliance'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[3]).getByText('somewhat'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-compliance'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('somewhat'))
})

test('Management Regime Records table sorts properly by Open Access column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-openAccess'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes B'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-openAccess'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by Access Restrictions column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-accessRestriction'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes C'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-accessRestriction'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes B'))
})

test('Management Regime Records table sorts properly by Periodic Closure column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-periodicClosure'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes C'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-periodicClosure'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes B'))
})

test('Management Regime Records table sorts properly by Size Limits column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-sizeLimits'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes C'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-sizeLimits'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes B'))
})

test('Management Regime Records table sorts properly by Gear Restrictions column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-gearRestriction'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-gearRestriction'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by Species Restrictions column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-speciesRestriction'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-speciesRestriction'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by No Take column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/management-regimes" element={<ManagementRegimes />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/management-regimes'],
      dexiePerUserDataInstance,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // click the Management Regime Name column twice to disable default sorting
  await user.dblClick(within(table).getByTestId('management-regime-header-name'))

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  await user.click(within(table).getByTestId('management-regime-header-noTake'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // click again to change to descending order
  await user.click(within(table).getByTestId('management-regime-header-noTake'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})
