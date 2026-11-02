import React, { useId } from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import theme from '../../../theme'
import { MessageType } from '../../../types/constants'
import { ButtonThatLooksLikeLinkUnderlined } from '../buttons'
import { MessagePill } from '../InlineMessage/InlineMessage'
import { useValidationDisclosure } from './ValidationDisclosure'

interface GroupMessage {
  status?: MessageType | 'ok'
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

const GroupWrapper = styled.div`
  flex: 1;
  min-width: 0;
`

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

const ToggleButton = styled(ButtonThatLooksLikeLinkUnderlined)`
  font-size: inherit;
`

// Stacks messages the way a field's own list does, since a field passes its messages unwrapped.
const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xsmall};
  margin-top: ${theme.spacing.xsmall};

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
  const { canCollapse, isOpen, toggle } = useValidationDisclosure(disclosureKey)
  const summaryId = useId()
  const listId = useId()

  const isAlwaysOpen =
    !canCollapse || messages.length < 2 || messages.some(({ isStale }) => isStale)

  if (isAlwaysOpen) {
    return <>{children}</>
  }

  const chips = CHIP_STATUSES.map((status) => ({
    status,
    count: messages.filter((message) => message.status === status).length,
  })).filter(({ count }) => count > 0)

  return (
    <GroupWrapper data-testid="validation-message-group">
      <Summary>
        <Chips id={summaryId}>
          {chips.map(({ status, count }) => (
            <MessagePill key={status} type={status} data-testid={`validation-count-${status}`}>
              {t(CHIP_LABEL_KEYS[status], { count })}
            </MessagePill>
          ))}
        </Chips>
        <ToggleButton
          type="button"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-describedby={summaryId}
          onClick={toggle}
        >
          {isOpen ? t('validations.hide') : t('validations.show')}
        </ToggleButton>
      </Summary>
      <MessageList id={listId} hidden={!isOpen}>
        {children}
      </MessageList>
    </GroupWrapper>
  )
}

export default ValidationMessageGroup
