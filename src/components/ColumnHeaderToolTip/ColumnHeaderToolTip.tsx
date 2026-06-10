import React, { forwardRef, useLayoutEffect } from 'react'
import { styled } from 'styled-components'
import domPurify from 'dompurify'
import theme from '../../theme'

interface TooltipPopupProps {
  $maxWidth?: string
  $left?: string
  $top?: string
  $arrowOffset?: string
}

export const TooltipPopup = styled('span')<TooltipPopupProps>`
  display: block;
  max-width: min(${(props) => props.$maxWidth || '25rem'}, calc(100vw - 2rem));
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
  left: ${(props) => props.$left || '0em'};
  top: ${(props) => props.$top || '0em'};
  white-space: normal;
  z-index: 100;
  text-align: left;
`

interface ColumnHeaderToolTipProps {
  helperText?: React.ReactNode
  left?: string
  top?: string
  maxWidth?: string
  html?: string
  arrowOffset?: string
  onMount?: () => void
}

const ColumnHeaderToolTip = forwardRef<HTMLSpanElement, ColumnHeaderToolTipProps>(
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
        $left={left}
        $maxWidth={maxWidth}
        $top={top}
        $arrowOffset={arrowOffset}
      >
        {/* eslint-disable-next-line react/no-danger */}
        {html ? <div dangerouslySetInnerHTML={{ __html: cleanHTML }} /> : <span>{helperText}</span>}
      </TooltipPopup>
    )
  },
)

ColumnHeaderToolTip.displayName = 'ColumnHeaderToolTip'

export default ColumnHeaderToolTip
