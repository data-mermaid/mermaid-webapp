import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import theme from '../../theme'

export const TooltipPopup = styled('span')`
  display: block;
  max-width: 25rem;
  width: max-content;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  clip-path: polygon(0% 0%, 100% 0%, 100% 83%, 53% 83%, 47% 100%, 40% 83%, 0 83%);
  padding: 1em;
  padding-bottom: ${(props) => props.paddingBottom || `calc(4rem - 15px)`};
  bottom: ${(props) => props.bottom || '4em'};
  left: ${(props) => props.left || '0'};
  white-space: normal;
  z-index: 100;
  text-align: left;
`

const ColumnHeaderToolTip = ({ helperText, bottom, left, paddingBottom }) => {
  return (
    <TooltipPopup
      role="tooltip"
      aria-labelledby="tooltip"
      bottom={bottom}
      left={left}
      paddingBottom={paddingBottom}
    >
      {helperText}
    </TooltipPopup>
  )
}

export default ColumnHeaderToolTip

ColumnHeaderToolTip.defaultProps = {
  bottom: '4em',
  left: '0em',
  paddingBottom: 'calc(4rem - 15px)',
}

ColumnHeaderToolTip.propTypes = {
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  bottom: PropTypes.string,
  left: PropTypes.string,
  paddingBottom: PropTypes.string,
}
