import React, { useState, useEffect, useRef } from 'react'
import { LabelContainer } from '../generic/form'
import { IconInfo } from '../icons'
import { IconButton } from '../generic/buttons'
import ColumnHeaderToolTip from './ColumnHeaderToolTip'
import useTooltipPosition from '../../library/useTooltipPosition'

interface LabelWithTooltipProps {
  label: React.ReactNode
  tooltipText: React.ReactNode
  // groupRef is an optional shared ref({ current: closeFn | null }) passed to a set of sibling
  // instances. Opening one tooltip calls groupRef.current() to close whichever is currently open,
  // ensuring only one is visible at a time without lifting state to the parent.
  groupRef?: React.MutableRefObject<(() => void) | null>
}

const LabelWithTooltip = ({ label, tooltipText, groupRef }: LabelWithTooltipProps) => {
  const [isTooltipTextShowing, setIsTooltipTextShowing] = useState(false)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [tooltipStyle, computeTooltipPosition] = useTooltipPosition(
    iconRef,
    containerRef,
    tooltipRef,
  )

  useEffect(() => {
    if (!isTooltipTextShowing) {
      return undefined
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsTooltipTextShowing(false)
        if (groupRef) {
          groupRef.current = null
        }
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [isTooltipTextShowing, groupRef])

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!isTooltipTextShowing) {
      if (groupRef) {
        groupRef.current?.()
        groupRef.current = () => setIsTooltipTextShowing(false)
      }
      setIsTooltipTextShowing(true)
    } else {
      if (groupRef) {
        groupRef.current = null
      }
      setIsTooltipTextShowing(false)
    }
  }

  return (
    <LabelContainer ref={containerRef}>
      {label}
      <IconButton ref={iconRef} type="button" onClick={handleIconClick}>
        <IconInfo aria-label="info" />
      </IconButton>
      {isTooltipTextShowing ? (
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

export default LabelWithTooltip
