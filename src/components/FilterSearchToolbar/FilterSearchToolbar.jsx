import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Input, LabelContainer, inputStyles } from '../generic/form'
import { IconInfo } from '../icons'
import { IconButton } from '../generic/buttons'
import ColumnHeaderToolTip from '../ColumnHeaderToolTip/ColumnHeaderToolTip'
import useTooltipPosition from '../../library/useTooltipPosition'
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

const FilterSearchToolbar = ({
  id = 'filter-search',
  name,
  disabled = false,
  globalSearchText = '', // react-table sets globalFilter to undefined when cleared; default to '' to keep the input controlled
  handleGlobalFilterChange,
  groupRef = null,
}) => {
  const { t } = useTranslation()
  const [isTooltipTextShowing, setIsHelperTextShowing] = useState(false)
  const tooltipRef = useRef(null)
  const iconRef = useRef(null)
  const labelContainerRef = useRef(null)

  const [tooltipStyle, computeTooltipPosition] = useTooltipPosition(
    iconRef,
    labelContainerRef,
    tooltipRef,
  )

  useEffect(() => {
    if (!isTooltipTextShowing) {
      return undefined
    }

    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        if (groupRef) {
          groupRef.current = null
        }
        setIsHelperTextShowing(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isTooltipTextShowing, groupRef])

  const handleFilterChange = (event) => {
    handleGlobalFilterChange(event.target.value)
  }

  const handleInfoIconClick = (event) => {
    event.stopPropagation()
    if (!isTooltipTextShowing) {
      if (groupRef) {
        groupRef.current?.()
        groupRef.current = () => setIsHelperTextShowing(false)
      }
      setIsHelperTextShowing(true)
    } else {
      if (groupRef) {
        groupRef.current = null
      }
      setIsHelperTextShowing(false)
    }
  }

  return (
    <FilterLabelWrapper htmlFor={id}>
      <LabelContainer ref={labelContainerRef}>
        {name}
        <IconButton ref={iconRef} type="button" onClick={handleInfoIconClick}>
          <IconInfo id="info-icon" aria-label="info" />
        </IconButton>
        {isTooltipTextShowing ? (
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
  groupRef: PropTypes.shape({
    current: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  }),
}

export default FilterSearchToolbar
