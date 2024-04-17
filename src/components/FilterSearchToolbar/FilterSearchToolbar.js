import React, { useState, useEffect } from 'react'
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
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const handleResize = () => {
      // Calculate the position of the icon relative to the viewport
      const iconInfoRect = document.getElementById(`icon-info-${id}`).getBoundingClientRect()
      const tooltipTop = `${iconInfoRect.top - 302}px`
      const tooltipLeft = `${iconInfoRect.left + iconInfoRect.width / 2 - 488}px`

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [id])

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
          <IconInfo id={`icon-info-${id}`} aria-label="info" />
        </IconButton>
        {isHelperTextShowing ? (
          <ColumnHeaderToolTip
            id={`aria-descp${id}`}
            left={tooltipPosition.left}
            top={tooltipPosition.top}
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
