import React from 'react'
import styled from 'styled-components'

import { useTranslation } from 'react-i18next'
import theme from '../../../theme'
import { MessageType } from '../../../types/constants'

interface InlineMessageProps {
  type?: MessageType
  children: React.ReactNode
  className?: string
}

const MessagePill = styled.span<{ type: MessageType }>`
  border: solid 1px ${theme.color.border};
  text-transform: uppercase;
  background: ${(props) => theme.color.getMessageColorBackground(props.type)};
  color: ${theme.color.textColor};
  padding: ${theme.spacing.xxsmall} ${theme.spacing.medium};
  border-radius: 5px;
  white-space: nowrap;
  height: fit-content;
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

const InlineMessage = ({
  type = 'warning',
  children,
  className = undefined,
}: InlineMessageProps) => {
  const { t } = useTranslation()

  return (
    <>
      {type && (
        <MessagePill type={type} className={className}>
          {t(`${type}`)}
        </MessagePill>
      )}
      <InlineMessageWrapper className={className} data-testid={`inline-message-${type}`}>
        {children}
      </InlineMessageWrapper>
    </>
  )
}

export default InlineMessage
