import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { IconClose } from '../../icons'
import theme from '../../../theme'
import { IconButton } from '../buttons'

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

const FilterAmount = styled.p`
  font-weight: bold;
  padding: 0 0.4em;
`

const FilterIndicatorPill = ({
  isMethodFilterEnabled = false,
  isSearchFilterEnabled = false,
  methodFilteredRowLength = null,
  searchFilteredRowLength = null,
  unfilteredRowLength,
  clearFilters,
}) => {
  const { t } = useTranslation()
  const [filteredAmountToDisplay, setFilteredAmountToDisplay] = useState(null)

  const _findFilteredAmountToDisplay = useEffect(() => {
    if (isSearchFilterEnabled) {
      return setFilteredAmountToDisplay(searchFilteredRowLength)
    }

    if (isMethodFilterEnabled) {
      return setFilteredAmountToDisplay(methodFilteredRowLength)
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
      {t('filtered')}{' '}
      <FilterAmount>
        {filteredAmountToDisplay} / {unfilteredRowLength}
      </FilterAmount>{' '}
      <IconButton type="button" onClick={clearFilters}>
        <IconClose />
      </IconButton>
    </FilterIndictorPillContainer>
  )
}

FilterIndicatorPill.propTypes = {
  unfilteredRowLength: PropTypes.number.isRequired,
  methodFilteredRowLength: PropTypes.number,
  searchFilteredRowLength: PropTypes.number,
  isMethodFilterEnabled: PropTypes.bool,
  isSearchFilterEnabled: PropTypes.bool,
  clearFilters: PropTypes.func.isRequired,
}

export default FilterIndicatorPill
