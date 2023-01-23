import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Select } from '../../form'

const PageSizeSelect = styled(Select)`
  width: auto;
  min-width: auto;
`

const PageSizeSelector = ({ pageSize, pageType, pageSizeOptions, onChange, rowLength }) => {
  const [pageOptionsToDisplay, setPageOptionsToDisplay] = useState([])

  const _findPageOptionsToDisplay = useEffect(() => {
    let pageOptionsLessThanRowLength = pageSizeOptions.filter((option) => option < rowLength)

    if (pageOptionsLessThanRowLength.length === 0) {
      // show the exact number of items as the only selection in the drop down
      pageOptionsLessThanRowLength = [rowLength]
    } else if (
      pageOptionsLessThanRowLength[pageOptionsLessThanRowLength.length - 1] < rowLength &&
      rowLength <= 100
    ) {
      // show the exact number of items as the last selection in the drop down (max 100 items at a time)
      pageOptionsLessThanRowLength.push(rowLength)
    }

    setPageOptionsToDisplay(pageOptionsLessThanRowLength)
  }, [pageSizeOptions, rowLength])

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
      of {rowLength} {pageType}
    </label>
  )
}

PageSizeSelector.propTypes = {
  rowLength: PropTypes.number.isRequired,
  pageType: PropTypes.string.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PageSizeSelector
