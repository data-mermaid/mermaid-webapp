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
  clip-path: polygon(
    //top left
    0 0,
    //top right
    100% 0,
    //bottom right
    100% calc(100% - 15px),
    // right size of arrow
    calc(50% + 10px) calc(100% - 15px),
    //bottom peak
    50% 100%,
    // left side of arrow
    calc(50% - 10px) calc(100% - 15px),
    //bottom left
    0 calc(100% - 15px)
  );
}
  padding: 1em;
  padding-bottom: calc(1rem + 15px);
  bottom: ${(props) => props.bottom || '4em'};
  left: ${(props) => props.left || '0'};
  white-space: normal;
  z-index: 100;
  text-align: left;
`

const ColumnHeaderToolTip = ({ helperText, bottom, left }) => {
  return (
    <TooltipPopup role="tooltip" aria-labelledby="tooltip" bottom={bottom} left={left}>
      {helperText}
    </TooltipPopup>
  )
}

export default ColumnHeaderToolTip

ColumnHeaderToolTip.defaultProps = {
  bottom: '4em',
  left: '0em',
}

ColumnHeaderToolTip.propTypes = {
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  bottom: PropTypes.string,
  left: PropTypes.string,
}
