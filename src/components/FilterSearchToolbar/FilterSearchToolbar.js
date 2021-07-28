import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../theme'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'

const inputStyles = css`
  padding: ${theme.spacing.small};
  width: 50%;
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.xsmall};
  `)}
`

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  margin-right: 10px;
  > input {
    ${inputStyles}
  }
`

const FilterSearchToolbar = ({ name, handleGlobalFilterChange }) => {
  const [filterInputValue, setFilterInputValue] = useState('')

  const handleFilterChange = (event) => {
    const { value } = event.target

    setFilterInputValue(value)
    handleGlobalFilterChange(value)
  }

  return (
    <FilterLabelWrapper htmlFor="filter-search">
      {name}
      <input
        type="text"
        id="filter-search"
        value={filterInputValue}
        onChange={handleFilterChange}
      />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.propTypes = {
  name: PropTypes.string.isRequired,
  handleGlobalFilterChange: PropTypes.func.isRequired,
}

export default FilterSearchToolbar
