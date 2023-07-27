import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Select } from '../../form'

const PageSizeSelect = styled(Select)`
  width: auto;
  min-width: auto;
`

const PageSizeSelector = ({
  pageSize,
  pageType,
  pageSizeOptions,
  onChange,
  unfilteredRowLength,
  methodFilteredRowLength,
  searchFilteredRowLength,
  isMethodFilterEnabled,
  isSearchFilterEnabled,
}) => {
  const [pageOptionsToDisplay, setPageOptionsToDisplay] = useState([])
  const [filteredAmountToDisplay, setFilteredAmountToDisplay] = useState(null)

  const _findFilteredAmountToDisplay = useEffect(() => {
    // the search results will be method filtered already, which is not the case the opposite way around
    if (isSearchFilterEnabled && isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(searchFilteredRowLength)
    }
    if (!isSearchFilterEnabled && isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(methodFilteredRowLength)
    }
    if (isSearchFilterEnabled && !isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(searchFilteredRowLength)
    }

    return setFilteredAmountToDisplay(unfilteredRowLength)
  }, [
    isMethodFilterEnabled,
    isSearchFilterEnabled,
    methodFilteredRowLength,
    searchFilteredRowLength,
    unfilteredRowLength,
  ])

  const _findPageOptionsToDisplay = useEffect(() => {
    let pageOptionsLessThanRowLength = pageSizeOptions.filter(
      (option) => option < filteredAmountToDisplay,
    )

    if (pageOptionsLessThanRowLength.length === 0) {
      // show the exact number of items as the only selection in the drop down
      pageOptionsLessThanRowLength = [filteredAmountToDisplay]
    } else if (
      pageOptionsLessThanRowLength[pageOptionsLessThanRowLength.length - 1] <
      filteredAmountToDisplay
    ) {
      // show the exact number of items as the last selection in the drop down
      pageOptionsLessThanRowLength.push(filteredAmountToDisplay)
    }

    setPageOptionsToDisplay(pageOptionsLessThanRowLength)
  }, [pageSizeOptions, filteredAmountToDisplay])

  return (
    <label htmlFor="page-size-selector">
      Showing{' '}
      <PageSizeSelect
        value={pageSize}
        onChange={onChange}
        id="page-size-selector"
        data-testid="page-size-selector"
      >
        {pageOptionsToDisplay.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </PageSizeSelect>{' '}
      of {filteredAmountToDisplay} {pageType}{' '}
      {isSearchFilterEnabled || isMethodFilterEnabled
        ? `(filtered from ${unfilteredRowLength})`
        : null}
    </label>
  )
}

PageSizeSelector.defaultProps = {
  methodFilteredRowLength: null,
  searchFilteredRowLength: null,
  isMethodFilterEnabled: false,
  isSearchFilterEnabled: false,
}

PageSizeSelector.propTypes = {
  unfilteredRowLength: PropTypes.number.isRequired,
  methodFilteredRowLength: PropTypes.number,
  searchFilteredRowLength: PropTypes.number,
  isMethodFilterEnabled: PropTypes.bool,
  isSearchFilterEnabled: PropTypes.bool,
  pageType: PropTypes.string.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PageSizeSelector
