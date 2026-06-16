import React, { useState, useEffect, useRef } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { LabelContainer } from '../generic/form'
import { IconInfo } from '../icons'
import { IconButton } from '../generic/buttons'
import tooltipStyles from '../../style/MuiComponents.module.scss'

interface LabelWithTooltipProps {
  label: React.ReactNode
  tooltipText: React.ReactNode
  // groupRef is an optional shared ref({ current: closeFn | null }) passed to a set of sibling
  // instances. Opening one tooltip calls groupRef.current() to close whichever is currently open,
  // ensuring only one is visible at a time without lifting state to the parent.
  groupRef?: React.MutableRefObject<(() => void) | null>
  maxWidth?: string
}

const LabelWithTooltip = ({ label, tooltipText, groupRef, maxWidth }: LabelWithTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const iconRef = useRef<HTMLButtonElement>(null)
  const popperRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    setIsOpen(false)
    if (groupRef) {
      groupRef.current = null
    }
  }

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (isOpen) {
      handleClose()
    } else {
      groupRef?.current?.()
      if (groupRef) {
        groupRef.current = handleClose
      }
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      const isOnIcon = iconRef.current?.contains(target)
      const isOnPopper = popperRef.current?.contains(target)
      if (!isOnIcon && !isOnPopper) {
        handleClose()
      }
    }

    // window capture fires before Downshift's document capture listener, so
    // stopImmediatePropagation from Downshift cannot block this handler.
    // The event continues to its target normally — no DOM overlay needed.
    window.addEventListener('pointerdown', handlePointerDown, { capture: true })

    return () => window.removeEventListener('pointerdown', handlePointerDown, { capture: true })
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LabelContainer>
      {label}
      <Tooltip
        title={tooltipText}
        placement="top"
        arrow
        open={isOpen}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        classes={{
          tooltip: tooltipStyles['MuiTooltip-tooltip'],
          arrow: tooltipStyles['MuiTooltip-arrow'],
        }}
        slotProps={{
          popper: {
            ref: popperRef,
            modifiers: [{ name: 'offset', options: { offset: [0, -10] } }],
          },
          tooltip: maxWidth ? { style: { maxWidth } } : undefined,
        }}
      >
        <IconButton ref={iconRef} type="button" onClick={handleIconClick}>
          <IconInfo aria-label="info" />
        </IconButton>
      </Tooltip>
    </LabelContainer>
  )
}

export default LabelWithTooltip
