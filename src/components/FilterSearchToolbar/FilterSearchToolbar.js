import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../theme'
import language from '../../language'
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

const FilterSearchToolbar = ({ filterInputValue, handleFilterChange }) => {
  return (
    <FilterLabelWrapper htmlFor="filter-search">
      {language.pages.submittedTable.filterToolbarText}
      <input
        type="text"
        id="filter-search"
        value={filterInputValue || ''}
        onChange={handleFilterChange}
      />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.propTypes = {
  filterInputValue: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
}

export default FilterSearchToolbar
