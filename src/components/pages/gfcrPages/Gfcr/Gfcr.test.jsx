import { expect, test, describe } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { Route, Routes } from 'react-router'
import { http, HttpResponse } from 'msw'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import Gfcr from './Gfcr'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// fakeCurrentUser in testingLibraryWithHelpers is an admin of this project, so titles render as links
const projectId = 'fake-project-id'

// Month names deliberately sort into a different order than the dates themselves, so a comparator
// working off the localized label rather than the raw value fails the sorting test below.
// Ascending by date: December 1 2023, February 10 2024, April 5 2025
// Ascending by month name: April, December, February
const mockIndicatorSets = [
  { id: 'set-1', title: 'Alpha set', indicator_set_type: 'report', report_date: '2024-02-10' },
  { id: 'set-2', title: 'Bravo set', indicator_set_type: 'target', report_date: '2025-04-05' },
  { id: 'set-3', title: 'Charlie set', indicator_set_type: 'report', report_date: '2023-12-01' },
]

const renderGfcrPage = () => {
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/projects/${projectId}/indicatorsets/`, () =>
      HttpResponse.json({
        count: mockIndicatorSets.length,
        next: null,
        results: mockIndicatorSets,
      }),
    ),
  )

  return renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/gfcr" element={<Gfcr />} />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      initialEntries: [`/projects/${projectId}/gfcr`],
    },
  )
}

const waitForTable = async () => {
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  return screen.findByRole('table')
}

// react-i18next is mocked in setupTests.js so t() returns the translation key.
// The label wraps the tooltip button as well as the input, so the selector narrows it down.
const getFilterInput = () => screen.getByLabelText('filters.by_title_date', { selector: 'input' })

const getBodyCellsInColumn = (table, columnIndex) =>
  within(table)
    .getAllByRole('row')
    .slice(1) // drop the header row
    .map((row) => within(row).getAllByRole('cell')[columnIndex].textContent)

const getBodyRowTitles = (table) => getBodyCellsInColumn(table, 0)
const getBodyRowTypes = (table) => getBodyCellsInColumn(table, 1)

describe('Gfcr indicator sets table', () => {
  test('renders the reporting date as a localized label', async () => {
    renderGfcrPage()

    const table = await waitForTable()

    // jsdom reports navigator.language as en-US
    expect(within(table).getByText('February 10, 2024')).toBeInTheDocument()
    expect(within(table).getByText('April 5, 2025')).toBeInTheDocument()
    expect(within(table).getByText('December 1, 2023')).toBeInTheDocument()
  })

  test('filters by title', async () => {
    const { user } = renderGfcrPage()

    const table = await waitForTable()

    await user.type(getFilterInput(), 'Bravo')

    expect(getBodyRowTitles(table)).toEqual(['Bravo set'])
  })

  test.each([
    ['a year', '2024', ['Alpha set']],
    ['a month name', 'February', ['Alpha set']],
    ['a lowercase month name', 'december', ['Charlie set']],
    ['a day and year', '5, 2025', ['Bravo set']],
  ])('filters by date typed as %s', async (_description, query, expectedTitles) => {
    const { user } = renderGfcrPage()

    const table = await waitForTable()

    await user.type(getFilterInput(), query)

    expect(getBodyRowTitles(table)).toEqual(expectedTitles)
  })

  test('shows no rows when the date filter matches nothing', async () => {
    const { user } = renderGfcrPage()

    const table = await waitForTable()

    await user.type(getFilterInput(), 'September')

    expect(getBodyRowTitles(table)).toEqual([])
  })

  // The M2075 card lists 2024-02-10 as a format to try, so this pins what it does rather than
  // leaving it to be rediscovered. splitSearchQueryStrings does not treat "-" as a word character,
  // so the query splits into the terms 2024, -, 02 and 10, which are matched with OR. "02" is a
  // substring of "2025" and "2023", so every row matches. Supported input is the format the column
  // displays; making YYYY-MM-DD narrow properly would mean changing the shared query splitter.
  test('does not narrow the list for a YYYY-MM-DD query, which is not a supported format', async () => {
    const { user } = renderGfcrPage()

    const table = await waitForTable()

    await user.type(getFilterInput(), '2024-02-10')

    expect(getBodyRowTitles(table)).toEqual(['Alpha set', 'Bravo set', 'Charlie set'])
  })

  test('sorts the reporting date column chronologically, not alphabetically by month name', async () => {
    const { user } = renderGfcrPage()

    const table = await waitForTable()

    // The table sorts by title ascending by default and multi-sort is always on, so the default
    // sort has to be cycled off (ascending -> descending -> removed) before the date column
    // becomes the only sort.
    await user.dblClick(screen.getByRole('columnheader', { name: 'title' }))

    const reportingDateHeader = screen.getByRole('columnheader', { name: 'gfcr.reporting_date' })

    await user.click(reportingDateHeader)

    expect(getBodyRowTitles(table)).toEqual(['Charlie set', 'Alpha set', 'Bravo set'])

    await user.click(reportingDateHeader)

    expect(getBodyRowTitles(table)).toEqual(['Bravo set', 'Alpha set', 'Charlie set'])
  })

  test('sorts the type column', async () => {
    const { user } = renderGfcrPage()

    const table = await waitForTable()

    await user.dblClick(screen.getByRole('columnheader', { name: 'title' }))

    const typeHeader = screen.getByRole('columnheader', { name: 'type' })

    await user.click(typeHeader)

    // Asserted on the type cells rather than the titles, because two rows share a type and
    // react-table does not guarantee the relative order of tied rows
    expect(getBodyRowTypes(table)).toEqual(['gfcr.report', 'gfcr.report', 'gfcr.target'])

    await user.click(typeHeader)

    expect(getBodyRowTypes(table)).toEqual(['gfcr.target', 'gfcr.report', 'gfcr.report'])
  })
})
