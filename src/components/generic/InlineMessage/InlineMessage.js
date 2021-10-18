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
  p {
    margin: 0 0 0 ${theme.spacing.small};
    font-size: smaller;
    max-width: ${theme.spacing.maxTextWidth};
  }
  a,
  span {
    font-size: inherit;
    color: inherit;
  }

  &.error {
    background: ${theme.color.cautionColor};
    border-color: ${theme.color.cautionBorder};
    p {
      color: ${theme.color.white};
    }
  }
  &.warning {
    background: ${theme.color.warningColor};
    border-color: ${theme.color.warningBorder};
  }
  &.info {
    background: ${theme.color.infoColor};
    border-color: ${theme.color.infoBorder};
  }
`

const InlineMessage = ({ type, children }) => {
  return (
    <InlineMessageWrapper className={type}>
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
