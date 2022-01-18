import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import theme from '../../../theme'
import { hoverState } from '../../../library/styling/mediaQueries'

const InlineMessageWrapper = styled.div`
  padding: calc(${theme.spacing.xsmall} + 1px);
  border-color: ${theme.color.textColor};
  border-width: 0 0 0 ${theme.spacing.borderLarge};
  border-style: solid;
  width: 100%;
  font-size: smaller;
  p {
    margin: 0 0 0 ${theme.spacing.small};
    max-width: ${theme.spacing.maxTextWidth};
  }
  a,
  span {
    font-size: inherit;
    color: inherit;
  }
  background: ${(props) => theme.color.getMessageColorBackground(props.type)};
  border-color: ${(props) => theme.color.getBorderColor(props.type)};
  ${hoverState(css`
    background: ${(props) => theme.color.getHoverColor(props.type)};
  `)}
`

const InlineMessage = ({ type, children, className }) => {
  return (
    <InlineMessageWrapper className={className} type={type}>
      {children}
    </InlineMessageWrapper>
  )
}

InlineMessage.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
}
InlineMessage.defaultProps = { type: 'warning', className: undefined }

export default InlineMessage
