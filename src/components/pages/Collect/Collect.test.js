import '@testing-library/jest-dom'

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Collect from './Collect'

test('Collect Records table sorts properly by method column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const pageSizeSelector = await screen.findByTestId('page-size-selector')

  await waitFor(() => within(pageSizeSelector).getByText('21'))

  // show all the records
  await user.selectOptions(pageSizeSelector, '21')

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click twice to change to descending order
  await user.dblClick(within(table).getByText('Method'))

  const tableRowsAfterDescending = within(table).getAllByRole('row')

  expect(within(tableRowsAfterDescending[1]).getByText('Habitat Complexity'))

  await user.dblClick(within(table).getByText('Method'))

  const tableRowsAfterAscending = within(table).getAllByRole('row')

  expect(within(tableRowsAfterAscending[1]).getByText('Benthic LIT'))
})

test('Collect Records table sorts properly by site column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Site C'))

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Site'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Site C'))

  // click again to change to descending order
  await user.click(within(table).getByText('Site'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Site D'))
})

test('Collect Records table sorts properly by management column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes C'))

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Management Regime'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes B'))

  // click again to change to descending order
  await user.click(within(table).getByText('Management Regime'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Collect Records table sorts properly by sample unit # column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('5 FB-1'))

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Sample Unit #'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('2'))

  // // click again to change to descending order
  await user.click(within(table).getByText('Sample Unit #'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('5 FB-1'))
})

test('Collect Records table sorts properly by size column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  await user.selectOptions(screen.getByTestId('page-size-selector'), '21')

  expect(within(tableRows[1]).getByText('10m'))

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Size'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('5m x 2m'))

  // // click again to change to descending order
  await user.click(within(table).getByText('Size'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('10m'))
})

test('Collect Records table sorts properly by depth column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('20'))

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Depth (m)'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('10'))

  // // click again to change to descending order
  await user.click(within(table).getByText('Depth (m)'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('20'))
})
test('Collect Records table sorts properly by sample date column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  await user.selectOptions(screen.getByTestId('page-size-selector'), '21')

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Sample Date'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('November 22, 2001'))

  // // click again to change to descending order
  await user.click(within(table).getByText('Sample Date'))

  const tableRowsAfterSecondClick = within(table).getAllByRole('row')

  // test last row. (heads up, this is a multi page table)
  expect(within(tableRowsAfterSecondClick[20]).getByText('June 12, 2012'))
})

test('Collect Records table sorts properly by observers column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Al Leonard, Melissa Nunes'))

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Observers'))

  const tableRowsAfter = within(table).getAllByRole('row')

  const tableCellsFromTableRowsAfter = within(tableRowsAfter[1]).getAllByRole('cell')

  expect(within(tableCellsFromTableRowsAfter[7]).getByText('Al Leonard'))

  // // click again to change to descending order
  await user.click(within(table).getByText('Observers'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Nick Hoang, Kim Fisher, Dustin Sampson'))
})

test('Collect Records table sorts properly by sample date column', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const table = screen.getByRole('table')

  // Double click all of the default sort columns twice to disable default sorting
  await user.dblClick(within(table).getByText('Site'))
  await user.dblClick(within(table).getByText('Method'))
  await user.dblClick(within(table).getByText('Sample Date'))
  await user.dblClick(within(table).getByText('Sample Unit #'))

  // click once to change to ascending order
  await user.click(within(table).getByText('Sample Date'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('November 22, 2001'))

  // click again to change to descending order
  await user.click(within(table).getByText('Sample Date'))

  const tableRowsAfterSecondClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterSecondClick[1]).getByText('March 11, 2021'))
})

test('Collect Records table changes number of rows visible size when pagination size is changed', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      initialEntries: ['/projects/5/collecting'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // 15 + header row
  expect(tableRows.length).toEqual(16)

  // await user.selectOptions(screen.getByTestId('page-size-selector'), '21')

  const pageSizeSelector = await screen.findByTestId('page-size-selector')

  await waitFor(() => expect(within(pageSizeSelector).getByText('21')))

  // show all the records
  await user.selectOptions(pageSizeSelector, '21')

  const tableRowsAfter = within(table).getAllByRole('row')

  // 21 mock records + header row
  expect(tableRowsAfter.length).toEqual(22)
})

test('Collect Records table change pages when different page is selected ', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting" element={<Collect />} />
    </Routes>,
    {
      dexiePerUserDataInstance,
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

  await user.click(within(PageSelector).getByText('2'))

  const linksToCollectRecords = within(table).getAllByRole('link')

  expect(linksToCollectRecords).toHaveLength(6)
})
