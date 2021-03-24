import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import mockOnlineMermaidDatabaseGatewayInstance from '../../../testUtilities/mockOnlineMermaidDatabaseGatewayInstance'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Collect from './Collect'

test('Collect component renders with the expected UI elements', () => {
  // const utilities = renderAuthenticatedOnline(<Collect />)
  // expect(screen.getByText('I should fail'))
})

test('Collect Records table sorts properly by method column', async () => {
  renderAuthenticatedOnline(
    <Collect
      mermaidDatabaseGatewayInstance={mockOnlineMermaidDatabaseGatewayInstance}
    />,
  )

  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
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
      mermaidDatabaseGatewayInstance={mockOnlineMermaidDatabaseGatewayInstance}
    />,
  )

  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('1203'))

  // click twice to change to descending order
  userEvent.dblClick(within(table).getByText('Management'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Karang Kapal'))
})
test('Collect Records table sorts properly by management column', () => {})
test('Collect Records table sorts properly by samplu unit # column', () => {})
test('Collect Records table sorts properly by size column', () => {})
test('Collect Records table sorts properly by depth column', () => {})
test('Collect Records table sorts properly by sample date column', () => {})
test('Collect Records table sorts properly by observers column', () => {})
test('Collect Records table sorts properly by status column', () => {})
test('Collect Records table sorts properly by synced column', () => {})

test('Collect Records table changes number of rows visible size when pagination size is changed', async () => {
  renderAuthenticatedOnline(
    <Collect
      mermaidDatabaseGatewayInstance={mockOnlineMermaidDatabaseGatewayInstance}
    />,
  )
  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
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
      mermaidDatabaseGatewayInstance={mockOnlineMermaidDatabaseGatewayInstance}
    />,
  )
  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
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
