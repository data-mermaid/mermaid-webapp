import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import theme from '../../theme'
import { Input, inputStyles } from '../generic/form'

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  justify-content: flex-end;
  > input {
    max-width: ${theme.spacing.maxTextWidth};
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
      <Input
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
