import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import theme from '../../theme'

export const TooltipP = styled('p')`
  white-space: nowrap;
  border-style: dotted;
  border-width: 0 0 ${theme.spacing.borderMedium} 0;
  position: relative;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  &:hover span,
  &:focus span {
    transition: ${theme.timing.hoverTransition};
    display: block;
  }
`

const tooltipCssByPosition = {
  bottom: css`
    top: 4rem;
    padding-top: calc(4rem - 15px);
    clip-path: polygon(
      calc(50% - 10px) 15px,
      50% 0,
      calc(50% + 10px) 15px,
      100% 15px,
      100% 100%,
      0 100%,
      0 15px
    );
  `,
  right: css`
    left: 4rem;
    padding-left: calc(4rem - 50%);
    clip-path: polygon(
      15px calc(50% - 6px),
      0 50%,
      15px calc(50% + 6px),
      15px 100%,
      100% 100%,
      100% 0,
      15px 0
    );
  `,
}
export const TooltipPopup = styled('span')<{ $position: 'bottom' | 'right' }>`
  display: none;
  min-width: 26ch;
  width: 100%;
  max-width: 52ch;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  padding: ${theme.spacing.small};
  white-space: normal;
  z-index: 100;
  text-align: center;
  ${({ $position }) => tooltipCssByPosition[$position]};
`

const TooltipWrapper = styled('div')`
  position: relative;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  &:hover span,
  &:focus span {
    transition: ${theme.timing.hoverTransition};
    display: block;
  }
`

export const TooltipWithText = ({
  text,
  tooltipText,
  id,
  position = 'bottom',
  ...restOfProps
}: {
  text: React.ReactNode
  tooltipText: string | React.ReactNode
  id: string
  position?: 'bottom' | 'right'
}) => {
  return (
    <TooltipP tabIndex={0} id={id} {...restOfProps}>
      {text}
      <TooltipPopup role="tooltip" aria-labelledby={id} $position={position}>
        {tooltipText}
      </TooltipPopup>
    </TooltipP>
  )
}

TooltipWithText.propTypes = {
  text: PropTypes.node.isRequired,
  tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  id: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['bottom', 'right']),
}

export const Tooltip = ({
  children,
  tooltipText,
  id,
  className,
  position = 'bottom',
}: {
  children: React.ReactNode
  tooltipText: string
  id: string
  className?: string
  position?: 'bottom' | 'right'
}) => {
  return (
    // className is so that we can override styles using styled-components,
    // which we need to do for image classification map control buttons
    <TooltipWrapper className={className}>
      {children}
      <TooltipPopup role="tooltip" aria-labelledby={id} $position={position}>
        {tooltipText}
      </TooltipPopup>
    </TooltipWrapper>
  )
}
