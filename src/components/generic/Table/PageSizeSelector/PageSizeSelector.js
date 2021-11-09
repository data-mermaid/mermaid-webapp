import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Select } from '../../form'

const PageSizeSelect = styled(Select)`
  width: auto;
  min-width: auto;
`

const PageSizeSelector = ({ pageSize, pageSizeOptions, onChange }) => {
  return (
    <label htmlFor="page-size-selector">
      Show{' '}
      <PageSizeSelect
        value={pageSize}
        onChange={onChange}
        id="page-size-selector"
        data-testid="page-size-selector"
      >
        {pageSizeOptions.map(size => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </PageSizeSelect>{' '}
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
