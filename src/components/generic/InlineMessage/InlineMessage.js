import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import theme from '../../../theme'

const InlineMessageWrapper = styled.div`
  padding: ${theme.spacing.xsmall};
  background: ${theme.color.white};
  border-color: ${theme.color.textColor};
  border-width: 0 0 0 ${theme.spacing.borderXLarge};
  border-style: solid;
  margin: ${theme.spacing.small} 0 0 0;
  p {
    margin: 0 0 0 ${theme.spacing.small};
    font-size: smaller;
    max-width: ${theme.spacing.maxTextWidth};
    color: ${(props) => (props.messageType === 'error' ? theme.color.white : 'inherit')};
  }
  a,
  span {
    font-size: inherit;
    color: inherit;
  }
  background: ${(props) => theme.color.getMessageColor(props.messageType)};
  border-color: ${(props) => theme.color.getBorderColor(props.messageType)};
`

const InlineMessage = ({ type, children }) => {
  return (
    <InlineMessageWrapper messageType={type}>
      <p>{children}</p>
    </InlineMessageWrapper>
  )
}

InlineMessage.propTypes = {
  children: PropTypes.string.isRequired,
  type: PropTypes.string,
}
InlineMessage.defaultProps = { type: 'warning' }

export default InlineMessage
