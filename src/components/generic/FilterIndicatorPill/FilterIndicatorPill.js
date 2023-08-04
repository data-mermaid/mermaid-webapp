import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'

const FilterIndictorPillContainer = styled.div``

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
      showing {filteredAmountToDisplay}/{unfilteredRowLength}
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
