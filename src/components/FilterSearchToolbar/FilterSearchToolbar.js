import React, { useState } from 'react'
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

const FilterSearchToolbar = ({
  id,
  name,
  disabled,
  globalSearchText,
  handleGlobalFilterChange,
}) => {
  const [searchText, setSearchText] = useState(globalSearchText)

  const handleFilterChange = (event) => {
    const eventValue = event.target.value

    setSearchText(eventValue)
    handleGlobalFilterChange(eventValue)
  }

  return (
    <FilterLabelWrapper htmlFor={id}>
      {name}
      <FilterInput
        type="text"
        id={id}
        value={searchText}
        onChange={handleFilterChange}
        disabled={disabled}
      />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.defaultProps = {
  id: 'filter-search',
  disabled: false,
  globalSearchText: '',
}

FilterSearchToolbar.propTypes = {
  handleGlobalFilterChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  globalSearchText: PropTypes.string,
}

export default FilterSearchToolbar
