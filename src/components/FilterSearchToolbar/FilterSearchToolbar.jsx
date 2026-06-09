import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Input, LabelContainer, inputStyles } from '../generic/form'
import { IconInfo } from '../icons'
import { IconButton } from '../generic/buttons'
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
    props.$hasFilter ? theme.color.getMessageColorBackground('warning') : 'transparent'};

  &:autofill {
    background-color: ${(props) =>
      props.$hasFilter ? theme.color.getMessageColorBackground('warning') : 'transparent'};
  }
`

const VIEWPORT_MARGIN = 8

const FilterSearchToolbar = ({
  id = 'filter-search',
  name,
  disabled = false,
  globalSearchText = '', // react-table sets globalFilter to undefined when cleared; default to '' to keep the input controlled
  handleGlobalFilterChange,
}) => {
  const { t } = useTranslation()
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({ top: '0px', left: '0px', arrowOffset: '50%' })
  const tooltipRef = useRef(null)
  const iconRef = useRef(null)
  const labelContainerRef = useRef(null)

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

  const computeTooltipPosition = useCallback(() => {
    if (!iconRef.current || !labelContainerRef.current || !tooltipRef.current) {
      return
    }

    const iconRect = iconRef.current.getBoundingClientRect()
    const containerRect = labelContainerRef.current.getBoundingClientRect()
    const tooltipWidth = tooltipRef.current.offsetWidth
    const tooltipHeight = tooltipRef.current.offsetHeight

    const iconCenterX = iconRect.left + iconRect.width / 2 - containerRect.left
    let left = iconCenterX - tooltipWidth / 2
    const top = -tooltipHeight

    // clamp to viewport
    const absLeft = containerRect.left + left
    const absRight = absLeft + tooltipWidth
    if (absRight > window.innerWidth - VIEWPORT_MARGIN) {
      left -= absRight - (window.innerWidth - VIEWPORT_MARGIN)
    }
    if (containerRect.left + left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN - containerRect.left
    }

    // arrow tracks the icon regardless of clamping
    const arrowOffset = `${iconCenterX - left}px`

    setTooltipStyle({ top: `${top}px`, left: `${left}px`, arrowOffset })
  }, [])

  const handleFilterChange = (event) => {
    handleGlobalFilterChange(event.target.value)
  }

  const handleInfoIconClick = (event) => {
    event.stopPropagation()
    setIsHelperTextShowing((prev) => !prev)
  }

  return (
    <FilterLabelWrapper htmlFor={id}>
      <LabelContainer ref={labelContainerRef}>
        {name}
        <IconButton ref={iconRef} type="button" onClick={handleInfoIconClick}>
          <IconInfo id="info-icon" aria-label="info" />
        </IconButton>
        {isHelperTextShowing ? (
          <ColumnHeaderToolTip
            id={`aria-descp${id}`}
            left={tooltipStyle.left}
            top={tooltipStyle.top}
            arrowOffset={tooltipStyle.arrowOffset}
            maxWidth="50em"
            html={t('filters.search_helper_text')}
            ref={tooltipRef}
            onMount={computeTooltipPosition}
          />
        ) : null}
      </LabelContainer>
      <FilterInput
        type="text"
        id={id}
        value={globalSearchText}
        onChange={handleFilterChange}
        disabled={disabled}
        $hasFilter={globalSearchText && globalSearchText.length > 0}
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
}

export default FilterSearchToolbar
