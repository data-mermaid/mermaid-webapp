import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Input, LabelContainer, inputStyles } from '../generic/form'
import { IconInfo } from '../icons'
import { IconButton } from '../generic/buttons'
import language from '../../language'
import ColumnHeaderToolTip from '../ColumnHeaderToolTip/ColumnHeaderToolTip'

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
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)

  const handleFilterChange = (event) => {
    const eventValue = event.target.value

    setSearchText(eventValue)
    handleGlobalFilterChange(eventValue)
  }

  const handleInfoIconClick = (event) => {
    isHelperTextShowing ? setIsHelperTextShowing(false) : setIsHelperTextShowing(true)

    event.stopPropagation()
  }

  return (
    <FilterLabelWrapper htmlFor={id}>
      <LabelContainer>
        {name}
        <IconButton
          type="button"
          onClick={(event) => handleInfoIconClick(event, 'benthicAttribute')}
        >
          <IconInfo aria-label="info" />
        </IconButton>
        {isHelperTextShowing ? (
          <ColumnHeaderToolTip
            id={`aria-descp${id}`}
            left="22em"
            top="7em"
            bottom="58em"
            maxWidth="50em"
            html={language.pages.submittedTable.filterSearchHelperText.__html}
          />
        ) : null}
      </LabelContainer>
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
}

FilterSearchToolbar.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  globalSearchText: PropTypes.string.isRequired,
  handleGlobalFilterChange: PropTypes.func.isRequired,
}

export default FilterSearchToolbar
