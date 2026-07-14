import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { mockT } from '../../../../testUtilities/mockT'
import PageSizeSelector from './PageSizeSelector'

// The react-i18next mock (see setupTests.js) makes t() return the key it is
// called with, so assertions target stable token keys rather than English text.

const defaultProps = {
  pageSize: 15,
  pageType: 'sample_unit',
  pageSizeOptions: [15, 50, 100],
  onChange: () => {},
  unfilteredRowLength: 200,
}

test('PageSizeSelector tokenises the "showing … of …" text and renders the size dropdown', () => {
  renderAuthenticatedOnline(<PageSizeSelector {...defaultProps} />)

  const label = screen.getByTestId('page-size-selector').closest('label')
  expect(label).toHaveTextContent('page_size_selector.showing')
  expect(label).toHaveTextContent('page_size_selector.of_total')
  expect(screen.getByTestId('page-size-selector')).toBeInTheDocument()
})

test('PageSizeSelector does not render the filtered-from clause when no filter is enabled', () => {
  renderAuthenticatedOnline(<PageSizeSelector {...defaultProps} />)

  const label = screen.getByTestId('page-size-selector').closest('label')
  expect(label).not.toHaveTextContent('page_size_selector.filtered_from')
})

test('PageSizeSelector renders a tokenised, translated filtered-from clause when filtering', () => {
  renderAuthenticatedOnline(
    <PageSizeSelector
      {...defaultProps}
      unfilteredRowLength={87}
      searchFilteredRowLength={15}
      isSearchFilterEnabled
    />,
  )

  const label = screen.getByTestId('page-size-selector').closest('label')
  expect(label).toHaveTextContent('page_size_selector.filtered_from')

  // The item type is translated (not the raw English pageType prop) and its
  // plural form is driven by the unfiltered row count, not a hardcoded "s".
  expect(mockT).toHaveBeenCalledWith('page_size_selector.item_type.sample_unit', {
    count: 87,
  })
  expect(mockT).toHaveBeenCalledWith('page_size_selector.filtered_from', {
    count: 87,
    itemType: 'page_size_selector.item_type.sample_unit',
  })
})

test('PageSizeSelector resolves the singular item type when the unfiltered count is 1', () => {
  renderAuthenticatedOnline(
    <PageSizeSelector
      {...defaultProps}
      unfilteredRowLength={1}
      searchFilteredRowLength={1}
      isSearchFilterEnabled
    />,
  )

  expect(mockT).toHaveBeenCalledWith('page_size_selector.item_type.sample_unit', {
    count: 1,
  })
})

test('PageSizeSelector translates the item type for the given pageType', () => {
  renderAuthenticatedOnline(
    <PageSizeSelector
      {...defaultProps}
      pageType="management_regime"
      unfilteredRowLength={5}
      methodFilteredRowLength={2}
      isMethodFilterEnabled
    />,
  )

  expect(mockT).toHaveBeenCalledWith('page_size_selector.item_type.management_regime', {
    count: 5,
  })
})

test('PageSizeSelector calls onChange when a different page size is selected', async () => {
  const handleChange = vi.fn()

  const { user } = renderAuthenticatedOnline(
    <PageSizeSelector {...defaultProps} onChange={handleChange} />,
  )

  await user.selectOptions(screen.getByTestId('page-size-selector'), '50')

  expect(handleChange).toHaveBeenCalledTimes(1)
})
