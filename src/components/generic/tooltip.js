import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
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
export const TooltipPopup = styled('span')`
  display: none;
  min-width: 26ch;
  width: 100%;
  max-width: 52ch;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  clip-path: polygon(
    calc(50% - 10px) 15px,
    50% 0,
    calc(50% + 10px) 15px,
    100% 15px,
    100% 100%,
    0 100%,
    0 15px
  );
  padding: ${theme.spacing.small};
  padding-top: calc(4rem - 15px);
  top: 4rem;
  white-space: normal;
  z-index: 100;
  text-align: center;
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

export const TooltipWithText = ({ text, tooltipText, id, ...restOfProps }) => {
  return (
    <TooltipP tabIndex="0" id={id} {...restOfProps}>
      {text}
      <TooltipPopup role="tooltip" aria-labelledby={id}>
        {tooltipText}
      </TooltipPopup>
    </TooltipP>
  )
}

TooltipWithText.propTypes = {
  text: PropTypes.node.isRequired,
  tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  id: PropTypes.string.isRequired,
}

export const Tooltip = ({ children, tooltipText, id }) => {
  return (
    <TooltipWrapper>
      {children}
      <TooltipPopup role="tooltip" aria-labelledby={id}>
        {tooltipText}
      </TooltipPopup>
    </TooltipWrapper>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  id: PropTypes.string.isRequired,
}
