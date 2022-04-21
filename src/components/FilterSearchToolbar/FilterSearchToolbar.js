import React from 'react'
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

const FilterSearchToolbar = ({
  name,
  handleGlobalFilterChange,
  value
}) => {
  const handleFilterChange = event => {
    const { value: eventValue } = event.target

    handleGlobalFilterChange(eventValue)
  }

  return (
    <FilterLabelWrapper htmlFor="filter-search">
      {name}
      <Input
        type="text"
        id="filter-search"
        value={value}
        onChange={handleFilterChange}
      />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.defaultProps = {
  value: undefined
}

FilterSearchToolbar.propTypes = {
  name: PropTypes.string.isRequired,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default FilterSearchToolbar
