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

const FilterSearchToolbar = ({
  name,
  handleGlobalFilterChange,
  value: valueFromProps,
  defaultValue
}) => {
  // Component is controlled when value is not undefined
  const isControlled = valueFromProps !== undefined
  // An uncontrolled component can have a default value
  const hasDefaultValue = defaultValue !== undefined

  const [internalValue, setInternalValue] = useState(hasDefaultValue ? defaultValue : '')

  // Get value from props or internal state. Depends on whether component is controlled or not
  const value = isControlled ? valueFromProps : internalValue

  const handleFilterChange = event => {
    const { value: eventValue } = event.target

    // If the value is uncontrolled, update the internal value
    if (!isControlled) {
      setInternalValue(eventValue)
    }

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
  value: undefined,
  defaultValue: undefined,
}

FilterSearchToolbar.propTypes = {
  name: PropTypes.string.isRequired,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
}

export default FilterSearchToolbar
