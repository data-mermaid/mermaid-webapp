import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import theme from '../../../theme'
import language from '../../../language'

const getWarningLable = (props) => language.inlineMessage[props.type]
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
    display: inline;
    align-self: center;
  }
  a,
  span {
    font-size: inherit;
    color: inherit;
  }
  border: none;
  &:before {
    content: '${getWarningLable}';
    border: solid 1px ${theme.color.border};
    text-transform: uppercase;
    background: ${(props) => theme.color.getMessageColorBackground(props.type)};
    color: ${theme.color.textColor};
    padding: ${theme.spacing.xxsmall} ${theme.spacing.medium};
    border-radius: 5px;
  }
`

const InlineMessage = ({ type, children, className }) => {
  return (
    <InlineMessageWrapper className={className} type={type}>
      {children}
    </InlineMessageWrapper>
  )
}

InlineMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
}
InlineMessage.defaultProps = { type: 'warning', className: undefined }

export default InlineMessage
