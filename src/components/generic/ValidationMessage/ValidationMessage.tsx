import React from 'react'
import { styled } from 'styled-components'

import theme from '../../../theme'
import { MessageType } from '../../../types/constants'
import InlineMessage from '../InlineMessage'

interface ValidationMessageProps {
  status: MessageType
  children: React.ReactNode
  action?: React.ReactNode
  isStale?: boolean
}

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;

  /* Edited since the last Validate. The pill keeps its colour, so the whole message fades
     rather than changing kind. */
  &[data-stale='true'] {
    filter: grayscale(1);
    opacity: 0.55;
  }
`

export const EditedNote = styled.p`
  margin: 0 0 0 ${theme.spacing.small};
  font-size: smaller;
  font-style: italic;
`

// One validation message: its pill, its text and, for a warning, its ignore control.
const ValidationMessage = ({
  status,
  children,
  action = null,
  isStale = false,
}: ValidationMessageProps) => (
  <MessageRow data-stale={isStale}>
    <InlineMessage type={status}>{children}</InlineMessage>
    {action}
  </MessageRow>
)

export default ValidationMessage
