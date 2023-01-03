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

const FilterSearchToolbar = ({ name, handleGlobalFilterChange, value, id }) => {
  const handleFilterChange = (event) => {
    const { value: eventValue } = event.target

    handleGlobalFilterChange(eventValue)
  }

  return (
    <FilterLabelWrapper htmlFor={id}>
      {name}
      <Input type="text" id={id} value={value} onChange={handleFilterChange} />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.defaultProps = {
  id: 'filter-search',
  value: undefined,
}

FilterSearchToolbar.propTypes = {
  handleGlobalFilterChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
}

export default FilterSearchToolbar
