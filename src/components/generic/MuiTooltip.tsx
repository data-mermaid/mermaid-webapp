import React, { ReactElement } from 'react'
import theme from '../../theme'
import { styled } from '@mui/material/styles'
import Tooltip, { type TooltipProps } from '@mui/material/Tooltip'

type Placement = 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | undefined

interface MuiTooltip {
  children: ReactElement
  title: string
  placement?: Placement
  bgColor?: string
  tooltipTextColor?: string
}

const StyledTooltip = styled(Tooltip, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'tooltipTextColor',
})<TooltipProps & { bgColor?: string; tooltipTextColor?: string }>(
  ({ bgColor, tooltipTextColor }) => ({
    '& .MuiTooltip-tooltip': {
      backgroundColor: bgColor,
      color: tooltipTextColor,
      fontSize: theme.typography.smallFontSize,
      boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.1)',
    },
    '& .MuiTooltip-arrow': {
      color: bgColor,
    },
  }),
)

export const MuiTooltip = ({
  children,
  title,
  placement = 'bottom',
  bgColor = theme.color.white,
  tooltipTextColor = theme.color.black,
}: MuiTooltip) => {
  return (
    // @ts-expect-error typing issues
    <StyledTooltip
      title={title}
      placement={placement}
      bgColor={bgColor}
      tooltipTextColor={tooltipTextColor}
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
    </StyledTooltip>
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
