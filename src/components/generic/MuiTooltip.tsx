import React, { ReactElement } from 'react'
import theme from '../../theme'
import Tooltip from '@mui/material/Tooltip'
import tooltipStyles from '../../style/MuiComponents.module.scss'

type Placement = 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | undefined

interface MuiTooltip {
  children: ReactElement
  title: string
  placement?: Placement
  bgColor?: string
  tooltipTextColor?: string
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
    <MuiTooltip
      title={title}
      bgColor={theme.color.primaryColor}
      tooltipTextColor={theme.color.white}
      placement={placement}
    >
      {children}
    </MuiTooltip>
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
