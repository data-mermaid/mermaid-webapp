import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import mockOnlineDatabaseSwitchboardInstance from '../../../testUtilities/mockOnlineDatabaseSwitchboardInstance'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Collect from './Collect'

test('Collect component renders with the expected UI elements', () => {
  // renderAuthenticatedOnline(<Collect />)
  // expect sample unit button exists
  // expect within form to have table headers with proper text for each column
  // can ignore testing title. Its logic will come later
  // expect page size selector (review M76 App.OnlineStatusMessage.test.js for inspiration on testing broken up text)
  // expect page selector. (ignore how many pages, maybe look for previous and next text)
})

test('Collect Records table sorts properly by method column', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Benthic LIT'))

  // click twice to change to descending order
  userEvent.dblClick(within(table).getByText('Method'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Fish Belt'))
})

test('Collect Records table sorts properly by site column', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Site C'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Site'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Site C'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Site'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Site D'))
})

test('Collect Records table sorts properly by management column', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes B'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Management'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes B'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Management'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Collect Records table sorts properly by sample unit # column', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('5 LIT-1'))

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
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('10m'))

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
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('20'))

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
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('11-Mar-2021'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Sample Date'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('21-Nov-2001'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Sample Date'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  const tableCellsFromTableRowsAfterFirstClick = within(
    tableRowsAfterFirstClick[1],
  ).getAllByRole('cell')

  expect(within(tableCellsFromTableRowsAfterFirstClick[6]).getByText(''))
})

test('Collect Records table sorts properly by observers column', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Nick, Melissa'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Observers'))

  const tableRowsAfter = within(table).getAllByRole('row')

  const tableCellsFromTableRowsAfter = within(tableRowsAfter[1]).getAllByRole(
    'cell',
  )

  expect(within(tableCellsFromTableRowsAfter[7]).getByText(''))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Observers'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Nick, Melissa'))
})

test('Collect Records table sorts properly by status column', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Saved'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Status'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Errors'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Status'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Warnings'))
})

test('Collect Records table sorts properly by synced column', () => {})

test('Collect Records table changes number of rows visible size when pagination size is changed', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )
  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  // 10 + header row
  expect(tableRows.length).toEqual(11)

  userEvent.selectOptions(screen.getByTestId('page-size-selector'), '50')

  const tableRowsAfter = within(table).getAllByRole('row')

  // 11 + header row
  expect(tableRowsAfter.length).toEqual(12)
})

test('Collect Records table change pages when different page is selected ', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  const PageSelector = screen.getByTestId('page-control')

  // 10 + header row
  expect(tableRows.length).toEqual(11)

  userEvent.click(within(PageSelector).getByText('2'))

  const tableRowsAfter = within(table).getAllByRole('row')

  // 11 + header row
  expect(tableRowsAfter.length).toEqual(2)
})
