import React, { useId } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import theme from '../../../theme'
import { MessageType } from '../../../types/constants'
import { ButtonThatLooksLikeLinkUnderlined } from '../buttons'
import { MessagePill } from '../InlineMessage/InlineMessage'
import { useValidationDisclosure } from './ValidationDisclosure'

interface GroupMessage {
  status?: MessageType
  isStale?: boolean
}

interface ValidationMessageGroupProps {
  // Names the field or row in the form's disclosure store. See ValidationDisclosure.
  disclosureKey?: string
  messages: GroupMessage[]
  children: React.ReactNode
}

const CHIP_STATUSES = ['error', 'warning', 'ignore'] as const

// Shared with the form's status indicator chips, so a row's chip reads like the toolbar's.
const CHIP_LABEL_KEYS: Record<(typeof CHIP_STATUSES)[number], string> = {
  error: 'sample_units.validation_status.chip_label_error',
  warning: 'sample_units.validation_status.chip_label_warning',
  ignore: 'sample_units.validation_status.chip_label_ignored',
}

const Summary = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.xsmall};
  font-size: smaller;
`

const Chips = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xsmall};
`

// Stacks messages the way a field's own list does, since a field passes its messages unwrapped.
const MessageList = styled.div<{ $isCollapsible: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xsmall};
  margin-top: ${(props) => (props.$isCollapsible ? theme.spacing.xsmall : 0)};

  &[hidden] {
    display: none;
  }
`

// A field or row with two or more messages collapses to a count chip per status and a Show
// button. One message, or any message greyed by an edit, always shows in full: a greyed message
// is the diver's own recent change, so it stays visible until the next Validate.
const ValidationMessageGroup = ({
  disclosureKey = undefined,
  messages,
  children,
}: ValidationMessageGroupProps) => {
  const { t } = useTranslation()
  const { canCollapse, isOpen, open, toggle } = useValidationDisclosure(disclosureKey)
  const summaryId = useId()
  const listId = useId()

  const hasSeveralMessages = canCollapse && messages.length >= 2
  const isCollapsible = hasSeveralMessages && !messages.some(({ isStale }) => isStale)

  const chips = CHIP_STATUSES.map((status) => ({
    status,
    count: messages.filter((message) => message.status === status).length,
  })).filter(({ count }) => count > 0)

  // The same tree renders whether or not the group can collapse, so ticking or unticking an Ignore
  // box never remounts the messages and moves focus. A change inside the group also opens it, so
  // ignoring its last greyed warning leaves the messages on screen rather than collapsing them.
  return (
    <div data-testid="validation-message-group" onChange={hasSeveralMessages ? open : undefined}>
      {isCollapsible ? (
        <Summary>
          <Chips id={summaryId}>
            {chips.map(({ status, count }) => (
              <MessagePill key={status} type={status} data-testid={`validation-count-${status}`}>
                {t(CHIP_LABEL_KEYS[status], { count })}
              </MessagePill>
            ))}
          </Chips>
          <ButtonThatLooksLikeLinkUnderlined
            type="button"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-describedby={summaryId}
            onClick={toggle}
          >
            {isOpen ? t('validations.hide') : t('validations.show')}
          </ButtonThatLooksLikeLinkUnderlined>
        </Summary>
      ) : null}
      <MessageList id={listId} hidden={isCollapsible && !isOpen} $isCollapsible={isCollapsible}>
        {children}
      </MessageList>
    </div>
  )
}

export default ValidationMessageGroup
