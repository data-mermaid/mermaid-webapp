import React from 'react'
import styled from 'styled-components'

import language from '../../../language'
import theme from '../../../theme'
import { MessageType } from '../../../types/constants'
import { IconAlert, IconCloseCircle } from '../../icons'

interface InlineMessageProps {
  type?: MessageType
  children: React.ReactNode
  className?: string
}

const MessagePill = styled.span<{ type: MessageType }>`
  text-transform: uppercase;
  color: ${theme.color.textColor};
  padding: 0;
  border-radius: 5px;
  white-space: nowrap;
  height: fit-content;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xsmall};
  flex-shrink: 0;

  svg {
    color: inherit;
  }
`

const InlineMessageWrapper = styled.div`
  padding: 0;
  border: none;
  width: 100%;
  max-width: ${theme.spacing.maxWidth};
  font-size: ${theme.typography.smallFontSize};
  margin: 0;
  display: flex;
  gap: ${theme.spacing.medium};
  align-items: baseline;
  p {
    display: inline-block;
    margin: 0;
    font-size: ${theme.typography.smallFontSize};
  }
  a,
  span {
    font-size: inherit;
    color: inherit;
  }
`

const InlineMessage = ({
  type = 'warning',
  children,
  className = undefined,
}: InlineMessageProps) => {
  const getIcon = () => {
    if (type === 'error') {
      return <IconCloseCircle />
    }
    if (type === 'warning') {
      return <IconAlert />
    }
    return null
  }

  return (
    <InlineMessageWrapper className={className} data-testid={`inline-message-${type}`}>
      {type && (
        <MessagePill type={type} className={className}>
          {getIcon()}
        </MessagePill>
      )}
      {children}
    </InlineMessageWrapper>
  )
}

export default InlineMessage
