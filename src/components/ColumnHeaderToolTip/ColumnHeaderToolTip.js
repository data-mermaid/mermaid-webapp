import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import theme from '../../theme'

export const TooltipPopup = styled('span')`
  display: block;
  min-width: 26ch;
  width: 100%;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  clip-path: polygon(0% 0%, 100% 0%, 100% 83%, 53% 83%, 47% 100%, 40% 83%, 0 83%);
  padding: 1em;
  padding-bottom: calc(4rem - 15px);
  bottom: 3.5em;
  left: -1em;
  white-space: normal;
  z-index: 100;
`

const ColumnHeaderToolTip = ({ helperText }) => {
  return (
    <TooltipPopup role="tooltip" aria-labelledby="tooltip">
      {helperText}
    </TooltipPopup>
  )
}

export default ColumnHeaderToolTip

ColumnHeaderToolTip.propTypes = {
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}
