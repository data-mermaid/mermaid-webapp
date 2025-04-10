import { styled, Tooltip } from '@mui/material'
import type { TooltipProps } from '@mui/material/Tooltip'
import React, { ReactElement } from 'react'
import theme from '../../theme'

type Placement = 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | undefined

interface MuiTooltip {
  children: ReactElement
  title: string
  placement?: Placement
  bgColor?: string
  tooltipTextColor?: string
}

const StyledTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ tooltip: className }} />
  ),
  {
    shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'tooltipTextColor', // Prevent these props from being passed to the DOM
  },
)(({ bgColor, tooltipTextColor }: { bgColor?: string; tooltipTextColor?: string }) => ({
  backgroundColor: `${bgColor}`,
  color: `${tooltipTextColor}`,
  fontSize: `${theme.typography.smallFontSize}`,
  [`& .MuiTooltip-arrow`]: {
    color: `${bgColor}`,
  },
}))

export const MuiTooltip = ({
  children,
  title,
  placement = 'bottom',
  bgColor = theme.color.white,
  tooltipTextColor = theme.color.black,
}: MuiTooltip) => {
  return (
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
