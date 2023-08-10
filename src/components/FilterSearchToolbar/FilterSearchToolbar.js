import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Input, inputStyles } from '../generic/form'

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-grow: 0.5;
  flex-direction: column;
  justify-content: flex-end;
`

const FilterInput = styled(Input)`
  ${inputStyles};
`

const FilterSearchToolbar = ({ name, handleGlobalFilterChange, value, id, disabled }) => {
  const handleFilterChange = (event) => {
    const { value: eventValue } = event.target

    handleGlobalFilterChange(eventValue)
  }

  return (
    <FilterLabelWrapper htmlFor={id}>
      {name}
      <FilterInput
        type="text"
        id={id}
        value={value}
        onChange={handleFilterChange}
        disabled={disabled}
      />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.defaultProps = {
  id: 'filter-search',
  value: undefined,
  disabled: false,
}

FilterSearchToolbar.propTypes = {
  handleGlobalFilterChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
}

export default FilterSearchToolbar
