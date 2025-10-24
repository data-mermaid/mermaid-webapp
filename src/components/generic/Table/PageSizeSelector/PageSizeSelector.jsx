import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Select } from '../../form'

const PageSizeSelect = styled(Select)`
  width: auto;
  min-width: auto;
  margin-right: 0.3em;
`

const PageSizeSelector = ({
  pageSize,
  pageType,
  pageSizeOptions,
  onChange,
  unfilteredRowLength,
  methodFilteredRowLength = null,
  searchFilteredRowLength = null,
  isMethodFilterEnabled = false,
  isSearchFilterEnabled = false,
}) => {
  const { t } = useTranslation()
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
      {t('pagination.showing')}{' '}
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
      </PageSizeSelect>
      {t('pagination.of')} {filteredAmountToDisplay}
      {isSearchFilterEnabled || isMethodFilterEnabled
        ? `${' '}(${t('pagination.filtered_from')} ${unfilteredRowLength}${' '}${pageType}${
            unfilteredRowLength > 1 ? 's' : ''
          })`
        : null}
    </label>
  )
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
