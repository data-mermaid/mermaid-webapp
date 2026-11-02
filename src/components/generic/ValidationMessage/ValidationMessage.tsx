import React, { useId } from 'react'
import { styled } from 'styled-components'

import theme from '../../../theme'
import { MessageType } from '../../../types/constants'
import InlineMessage from '../InlineMessage'

interface ValidationMessageProps {
  status: MessageType
  children: React.ReactNode
  action?: React.ReactNode
  isStale?: boolean
  className?: string
}

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;

  /* Edited since the last Validate. The pill keeps its colour, so the whole message fades
     rather than changing kind. */
  &[data-stale='true'] {
    /* 0.7 keeps the text above the 4.5:1 contrast ratio on a white or striped cell. */
    filter: grayscale(1);
    opacity: 0.7;
  }
`

export const EditedNote = styled.p`
  margin: 0 0 0 ${theme.spacing.small};
  font-size: smaller;
  font-style: italic;
`

// One validation message: its pill, its text and, for a warning, its ignore control. Several
// controls on one row share a label, so each is described by the message it sits beside.
const ValidationMessage = ({
  status,
  children,
  action = null,
  isStale = false,
  className = undefined,
}: ValidationMessageProps) => {
  const messageId = useId()

  return (
    <MessageRow data-stale={isStale}>
      <InlineMessage type={status} id={messageId} className={className}>
        {children}
      </InlineMessage>
      {React.isValidElement<{ 'aria-describedby'?: string }>(action)
        ? React.cloneElement(action, { 'aria-describedby': messageId })
        : action}
    </MessageRow>
  )
}

export default ValidationMessage
