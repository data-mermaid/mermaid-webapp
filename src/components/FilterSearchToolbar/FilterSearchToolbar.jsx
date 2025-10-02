import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Input, LabelContainer, inputStyles } from '../generic/form'
import { IconInfo } from '../icons'
import { IconButton } from '../generic/buttons'
import language from '../../language'
import ColumnHeaderToolTip from '../ColumnHeaderToolTip/ColumnHeaderToolTip'
import theme from '../../theme'

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-grow: 0.5;
  flex-direction: column;
  justify-content: flex-end;
`

const FilterInput = styled(Input)`
  ${inputStyles};
  background-color: ${(props) =>
    props.hasFilter ? theme.color.getMessageColorBackground('warning') : 'transparent'};
`

const FilterSearchToolbar = ({
  id = 'filter-search',
  name,
  disabled = false,
  globalSearchText,
  handleGlobalFilterChange,
  type = 'page',
}) => {
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [maxWidth, setMaxWidth] = useState('50em')
  const tooltipRef = useRef(null)

  useEffect(() => {
    let pixelAdjustTop = 302

    let pixelAdjustLeft = 488

    if (type === 'copy-site-modal') {
      pixelAdjustLeft = 655
      pixelAdjustTop = 275
      setMaxWidth('60em')
    }
    if (type === 'copy-mr-modal') {
      pixelAdjustLeft = 328
    }

    const handleResize = () => {
      // Calculate the position of the icon relative to the viewport
      const iconInfoRect = document.getElementById('info-icon').getBoundingClientRect()
      const tooltipTop = `${iconInfoRect.top - pixelAdjustTop}px`
      const tooltipLeft = `${iconInfoRect.left + iconInfoRect.width / 2 - pixelAdjustLeft}px`

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [type])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsHelperTextShowing(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleFilterChange = (event) => {
    const eventValue = event.target.value

    handleGlobalFilterChange(eventValue)
  }

  const handleInfoIconClick = (event) => {
    setIsHelperTextShowing(!isHelperTextShowing)
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
          <IconInfo id="info-icon" aria-label="info" />
        </IconButton>
        {isHelperTextShowing ? (
          <ColumnHeaderToolTip
            id={`aria-descp${id}`}
            left={tooltipPosition.left}
            top={tooltipPosition.top}
            maxWidth={maxWidth}
            html={language.pages.submittedTable.filterSearchHelperText.__html}
            ref={tooltipRef}
          />
        ) : null}
      </LabelContainer>
      <FilterInput
        type="text"
        id={id}
        value={globalSearchText}
        onChange={handleFilterChange}
        disabled={disabled}
        hasFilter={globalSearchText && globalSearchText.length > 0}
      />
    </FilterLabelWrapper>
  )
}

FilterSearchToolbar.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  globalSearchText: PropTypes.string,
  handleGlobalFilterChange: PropTypes.func.isRequired,
  type: PropTypes.string,
}

export default FilterSearchToolbar
