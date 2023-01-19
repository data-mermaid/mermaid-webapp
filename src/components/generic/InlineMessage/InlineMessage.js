import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

import language from '../../../language'
import theme from '../../../theme'

const MessagePill = styled.span`
  border: solid 1px ${theme.color.border};
  text-transform: uppercase;
  background: ${(props) => theme.color.getMessageColorBackground(props.type)};
  color: ${theme.color.textColor};
  padding: ${theme.spacing.xxsmall} ${theme.spacing.medium};
  border-radius: 5px;
  white-space: nowrap;
`
const InlineMessageWrapper = styled.div`
  padding: calc(${theme.spacing.xsmall} + 1px);
  border: none;
  width: 100%;
  max-width: ${theme.spacing.maxWidth};
  font-size: smaller;
  margin: 0 0 0 ${theme.spacing.small};
  p {
    display: inline-block;
    margin: 0;
  }
  a,
  span {
    font-size: inherit;
    color: inherit;
  }
`

const InlineMessage = ({ type, children, className }) => {
  const typeToUse = type === 'reset' ? 'warning' : type

  return (
    <>
      {type && (
        <MessagePill type={typeToUse} className={className}>
          {language.inlineMessage[typeToUse]}
        </MessagePill>
      )}
      <InlineMessageWrapper className={className}>{children}</InlineMessageWrapper>
    </>
  )
}

InlineMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
}
InlineMessage.defaultProps = { type: 'warning', className: undefined }

export default InlineMessage
