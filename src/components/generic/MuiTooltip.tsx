import React, { ReactElement } from 'react'
import Tooltip from '@mui/material/Tooltip'
import tooltipStyles from '../../style/MuiComponents.module.scss'

type Placement = 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | undefined

interface MuiTooltip {
  children: ReactElement
  title: string
  placement?: Placement
}

export const MuiTooltip = ({ children, title, placement = 'bottom' }: MuiTooltip) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      classes={{
        tooltip: tooltipStyles['MuiTooltip-tooltip'],
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
    <MuiTooltipDark title={title} placement="right">
      {children}
    </MuiTooltipDark>
  )
}
