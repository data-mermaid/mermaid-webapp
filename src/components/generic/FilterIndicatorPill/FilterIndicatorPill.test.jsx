import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { renderAuthenticatedOnline, screen } from '../../../testUtilities/testingLibraryWithHelpers'
import { mockT } from '../../../testUtilities/mockT'
import FilterIndicatorPill from './FilterIndicatorPill'

// The react-i18next mock (see setupTests.js) makes t() return the key it is
// called with, so assertions target stable token keys rather than English text.

const defaultProps = {
  unfilteredRowLength: 87,
  clearFilters: () => {},
}

test('FilterIndicatorPill tokenises the "filtered" label instead of hardcoding English', () => {
  renderAuthenticatedOnline(<FilterIndicatorPill {...defaultProps} />)

  expect(mockT).toHaveBeenCalledWith('filters.filtered')
  expect(screen.getByText('filters.filtered', { exact: false })).toBeInTheDocument()
})

test('FilterIndicatorPill shows the search filtered count over the unfiltered count', () => {
  renderAuthenticatedOnline(
    <FilterIndicatorPill {...defaultProps} searchFilteredRowLength={15} isSearchFilterEnabled />,
  )

  expect(screen.getByText('15 / 87')).toBeInTheDocument()
})

test('FilterIndicatorPill shows the method filtered count when only the method filter is on', () => {
  renderAuthenticatedOnline(
    <FilterIndicatorPill {...defaultProps} methodFilteredRowLength={40} isMethodFilterEnabled />,
  )

  expect(screen.getByText('40 / 87')).toBeInTheDocument()
})

test('FilterIndicatorPill calls clearFilters when the close button is clicked', async () => {
  const handleClearFilters = vi.fn()

  const { user } = renderAuthenticatedOnline(
    <FilterIndicatorPill {...defaultProps} clearFilters={handleClearFilters} />,
  )

  await user.click(screen.getByRole('button'))

  expect(handleClearFilters).toHaveBeenCalledTimes(1)
})
