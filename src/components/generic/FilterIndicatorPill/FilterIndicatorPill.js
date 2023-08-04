import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'
import { IconClose } from '../../icons'
import theme from '../../../theme'

const FilterIndictorPillContainer = styled.div`
  border: solid 1px ${theme.color.border};
  color: ${theme.color.textColor};
  padding: ${theme.spacing.xxsmall} ${theme.spacing.medium};
  border-radius: 5px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 35px;
  background-color: ${theme.color.getMessageColorBackground('warning')};
`

const IconContainer = styled.div`
  cursor: pointer;
`

const FilterAmount = styled.p`
  font-weight: bold;
  padding: 0 0.4em;
`

const FilterIndicatorPill = ({
  isMethodFilterEnabled,
  isSearchFilterEnabled,
  methodFilteredRowLength,
  searchFilteredRowLength,
  unfilteredRowLength,
}) => {
  const [filteredAmountToDisplay, setFilteredAmountToDisplay] = useState(null)

  const _findFilteredAmountToDisplay = useEffect(() => {
    // the search results will be method filtered already, which is not the case the opposite way around
    if (isSearchFilterEnabled && isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(searchFilteredRowLength)
    }
    if (!isSearchFilterEnabled && isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(methodFilteredRowLength)
    }
    if (isSearchFilterEnabled && !isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(searchFilteredRowLength)
    }

    return setFilteredAmountToDisplay(unfilteredRowLength)
  }, [
    isMethodFilterEnabled,
    isSearchFilterEnabled,
    methodFilteredRowLength,
    searchFilteredRowLength,
    unfilteredRowLength,
  ])

  return (
    <FilterIndictorPillContainer>
      Filtered{' '}
      <FilterAmount>
        {filteredAmountToDisplay} / {unfilteredRowLength}
      </FilterAmount>{' '}
      <IconContainer>
        <IconClose />
      </IconContainer>
    </FilterIndictorPillContainer>
  )
}

FilterIndicatorPill.defaultProps = {
  methodFilteredRowLength: null,
  searchFilteredRowLength: null,
  isMethodFilterEnabled: false,
  isSearchFilterEnabled: false,
}

FilterIndicatorPill.propTypes = {
  unfilteredRowLength: PropTypes.number.isRequired,
  methodFilteredRowLength: PropTypes.number,
  searchFilteredRowLength: PropTypes.number,
  isMethodFilterEnabled: PropTypes.bool,
  isSearchFilterEnabled: PropTypes.bool,
}

export default FilterIndicatorPill
