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
import Collect from './Collect'

test('Collect Records table sorts properly by method column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Benthic LIT'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click twice to change to descending order
  userEvent.dblClick(within(table).getByText('Method'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Fish Belt'))
})

test('Collect Records table sorts properly by site column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Site C'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Site'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Site C'))

  // click again to change to descending order
  userEvent.click(within(table).getByText('Site'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Site D'))
})

test('Collect Records table sorts properly by management column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes B'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Management Regime'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes B'))

  // click again to change to descending order
  userEvent.click(within(table).getByText('Management Regime'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Collect Records table sorts properly by sample unit # column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('5 LIT-1'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Sample Unit #'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('2'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Sample Unit #'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('5 LIT-1'))
})

test('Collect Records table sorts properly by size column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('10m'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Size'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('5m x 2m'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Size'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('10m'))
})

test('Collect Records table sorts properly by depth column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('20'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Depth (m)'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('10'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Depth (m)'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('20'))
})
test('Collect Records table sorts properly by sample date column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('March 11, 2021'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Sample Date'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('November 22, 2001'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Sample Date'))

  const tableRowsAfterSecondClick = within(table).getAllByRole('row')

  // test last row. (heads up, this is a multi page table)
  expect(within(tableRowsAfterSecondClick[15]).getByText('June 12, 2012'))
})

test('Collect Records table sorts properly by observers column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Al Leonard, Melissa Nunes'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Observers'))

  const tableRowsAfter = within(table).getAllByRole('row')

  const tableCellsFromTableRowsAfter = within(tableRowsAfter[1]).getAllByRole('cell')

  expect(within(tableCellsFromTableRowsAfter[7]).getByText('Al Leonard'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Observers'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Nick Hoang, Kim Fisher, Dustin Sampson'))
})

test('Collect Records table sorts properly by status column', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Saved'))

  // click the Method column twice to disable default sorting
  userEvent.dblClick(within(table).getByText('Method'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Status'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Errors'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Status'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Warnings'))
})

test('Collect Records table changes number of rows visible size when pagination size is changed', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // 15 + header row
  expect(tableRows.length).toEqual(16)

  userEvent.selectOptions(screen.getByTestId('page-size-selector'), '50')

  const tableRowsAfter = within(table).getAllByRole('row')

  // 16 + header row
  expect(tableRowsAfter.length).toEqual(17)
})

test('Collect Records table change pages when different page is selected ', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect />
    </Route>,
    {
      dexieInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  const PageSelector = screen.getByTestId('page-control')

  // 15 + header row
  expect(tableRows.length).toEqual(16)

  userEvent.click(within(PageSelector).getByText('2'))

  const tableRowsAfter = within(table).getAllByRole('row')

  // 1 + header row
  expect(tableRowsAfter.length).toEqual(2)
})
