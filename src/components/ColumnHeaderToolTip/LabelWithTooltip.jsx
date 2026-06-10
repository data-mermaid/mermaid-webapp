import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { LabelContainer } from '../generic/form'
import { IconInfo } from '../icons'
import { IconButton } from '../generic/buttons'
import ColumnHeaderToolTip from './ColumnHeaderToolTip'
import useTooltipPosition from '../../library/useTooltipPosition'

// groupRef is an optional shared ref({ current: closeFn | null }) passed to a set of sibling
// instances. Opening one tooltip calls groupRef.current() to close whichever is currently open,
// ensuring only one is visible at a time without lifting state to the parent.
const LabelWithTooltip = ({ label, tooltipText, groupRef = undefined }) => {
  const [isShowing, setIsShowing] = useState(false)
  const tooltipRef = useRef(null)
  const iconRef = useRef(null)
  const containerRef = useRef(null)

  const [tooltipStyle, computeTooltipPosition] = useTooltipPosition(
    iconRef,
    containerRef,
    tooltipRef,
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsShowing(false)
        if (groupRef) {
          groupRef.current = null
        }
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [groupRef])

  const handleIconClick = (event) => {
    event.stopPropagation()
    if (!isShowing) {
      if (groupRef) {
        groupRef.current?.()
        groupRef.current = () => setIsShowing(false)
      }
      setIsShowing(true)
    } else {
      if (groupRef) {
        groupRef.current = null
      }
      setIsShowing(false)
    }
  }

  return (
    <LabelContainer ref={containerRef}>
      {label}
      <IconButton ref={iconRef} type="button" onClick={handleIconClick}>
        <IconInfo aria-label="info" />
      </IconButton>
      {isShowing ? (
        <ColumnHeaderToolTip
          helperText={tooltipText}
          left={tooltipStyle.left}
          top={tooltipStyle.top}
          arrowOffset={tooltipStyle.arrowOffset}
          ref={tooltipRef}
          onMount={computeTooltipPosition}
        />
      ) : null}
    </LabelContainer>
  )
}

LabelWithTooltip.propTypes = {
  label: PropTypes.node.isRequired,
  tooltipText: PropTypes.node.isRequired,
  groupRef: PropTypes.shape({ current: PropTypes.func }),
}

export default LabelWithTooltip
