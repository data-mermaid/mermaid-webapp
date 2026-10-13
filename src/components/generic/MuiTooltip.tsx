import React, { ReactElement } from 'react'
import Tooltip from '@mui/material/Tooltip'
import tooltipStyles from '../../style/MuiComponents.module.scss'

type Placement = 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | undefined

interface MuiTooltip {
  children: ReactElement
  title: string
  placement?: Placement
  variant?: 'default' | 'dark'
  /** Title describes the child rather than naming it. Use when it explains a control, e.g. why
   * it is unavailable. */
  describeChild?: boolean
  /** Stops the tooltip taking pointer events. These tooltips overlap their trigger (offset -10),
   * so an interactive one steals the pointer and the trigger's cursor. Leave off for tooltips
   * holding links or selectable text. */
  disableInteractive?: boolean
}

export const MuiTooltip = ({
  children,
  title,
  placement = 'bottom',
  variant = 'default',
  describeChild = false,
  disableInteractive = false,
}: MuiTooltip) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      describeChild={describeChild}
      disableInteractive={disableInteractive}
      classes={{
        tooltip:
          variant === 'dark'
            ? tooltipStyles['MuiTooltip-tooltip--dark']
            : tooltipStyles['MuiTooltip-tooltip'],
        arrow: tooltipStyles['MuiTooltip-arrow'],
      }}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
      arrow
    >
      {children}
    </Tooltip>
  )
}
export const MuiTooltipDark = ({
  title,
  children,
  placement,
}: {
  title: string
  children: ReactElement
  placement?: Placement
}) => {
  return (
    <Tooltip
      classes={{
        tooltip: tooltipStyles['MuiTooltip-tooltip--dark'],
        arrow: tooltipStyles['MuiTooltip-arrow'],
      }}
      title={title}
      placement={placement}
    >
      {children}
    </Tooltip>
  )
}
export const MuiTooltipDarkRight = ({
  title,
  children,
}: {
  title: string
  children: ReactElement
}) => {
  return (
    <MuiTooltip variant="dark" title={title} placement="right">
      {children}
    </MuiTooltip>
  )
}
