import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import ClickAwayListener from '@mui/material/ClickAwayListener'
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
}

const LabelWithTooltip = ({ label, tooltipText, groupRef }: LabelWithTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false)

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

  return (
    <ClickAwayListener onClickAway={handleClose}>
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
        >
          <IconButton type="button" onClick={handleIconClick}>
            <IconInfo aria-label="info" />
          </IconButton>
        </Tooltip>
      </LabelContainer>
    </ClickAwayListener>
  )
}

export default LabelWithTooltip
