import React, { forwardRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import domPurify from 'dompurify'
import theme from '../../theme'

export const TooltipPopup = styled('span')`
  display: block;
  max-width: ${(props) => props.maxWidth || '25rem'};
  width: max-content;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 15px),
    calc(${(props) => props.$arrowOffset || '50%'} + 10px) calc(100% - 15px),
    ${(props) => props.$arrowOffset || '50%'} 100%,
    calc(${(props) => props.$arrowOffset || '50%'} - 10px) calc(100% - 15px),
    0 calc(100% - 15px)
  );
  padding: 1em;
  padding-bottom: calc(1rem + 15px);
  left: ${(props) => props.left || '0em'};
  top: ${(props) => props.top || '0em'};
  white-space: normal;
  z-index: 100;
  text-align: left;
`

// eslint-disable-next-line react/display-name
const ColumnHeaderToolTip = forwardRef(
  (
    {
      helperText = '',
      left = '0em',
      top = '0em',
      maxWidth = '25rem',
      html = '',
      arrowOffset = '50%',
      onMount = undefined,
    },
    ref,
  ) => {
    const sanitizeHtml = domPurify.sanitize
    const cleanHTML = sanitizeHtml(html)

    useLayoutEffect(() => {
      onMount?.()
    }, [onMount])

    return (
      <TooltipPopup
        ref={ref}
        role="tooltip"
        aria-labelledby="tooltip"
        left={left}
        maxWidth={maxWidth}
        top={top}
        $arrowOffset={arrowOffset}
      >
        {/* eslint-disable-next-line react/no-danger */}
        {html ? <div dangerouslySetInnerHTML={{ __html: cleanHTML }} /> : <span>{helperText}</span>}
      </TooltipPopup>
    )
  },
)

export default ColumnHeaderToolTip

ColumnHeaderToolTip.propTypes = {
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  left: PropTypes.string,
  top: PropTypes.string,
  maxWidth: PropTypes.string,
  html: PropTypes.string,
  arrowOffset: PropTypes.string,
  onMount: PropTypes.func,
}
