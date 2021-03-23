import React from 'react'
import PropTypes from 'prop-types'
import { Select } from '../../form'

const PageSizeSelector = ({ pageSize, pageSizeOptions, onChange }) => {
  return (
    <label htmlFor="page-size-selector">
      Show{' '}
      <Select
        value={pageSize}
        onChange={onChange}
        id="page-size-selector"
        data-testid="page-size-selector"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>{' '}
      rows
    </label>
  )
}

PageSizeSelector.propTypes = {
  pageSize: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PageSizeSelector
