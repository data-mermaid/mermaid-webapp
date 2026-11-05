import React from 'react'
import { styled } from 'styled-components'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import theme from '../../../theme'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import ValidationMessage, { EditedNote } from '../../generic/ValidationMessage/ValidationMessage'
import ValidationMessageGroup from '../../generic/ValidationMessage/ValidationMessageGroup'
import { fieldDisclosureKey } from '../../generic/ValidationMessage/ValidationDisclosure'
import { getValidationMessage } from '../../../library/validationMessageHelpers'
import ResolveDuplicateSiteButtonAndModal from '../../ResolveDuplicateSiteButtonAndModal/ResolveDuplicateSiteButtonAndModal'
import ResolveDuplicateMRButtonAndModal from '../../ResolveDuplicateMRButtonAndModal/ResolveDuplicateMRButtonAndModal'
import InputIgnoreValidationWarningCheckboxWithLabel from '../InputIgnoreValidationWarningCheckboxWithLabel'

const ValidationWrapper = styled('div').attrs({
  className: 'validationWrapper', // Used to override styles in GFCR forms
})`
  padding-left: ${theme.spacing.small};
  display: flex;
  align-items: flex-start;
`

// Takes the width the field has rather than shrinking to its content, so a long message wraps.
const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xsmall};
  flex: 1;
  min-width: 0;
`

const SHOWN_STATUSES = ['error', 'warning', 'ignore']

const RESOLVE_MODALS = {
  not_unique_site: ResolveDuplicateSiteButtonAndModal,
  similar_name: ResolveDuplicateMRButtonAndModal,
}

const InputValidationInfo = ({
  ignoreNonObservationFieldValidations = () => {},
  unignoreNonObservationFieldValidations = () => {},
  validationPath = undefined,
  validationMessages = [],
  validationType = undefined,
  currentSelectValue = undefined,
  updateValueAndResetValidationForDuplicateWarning = () => {},
  additionalText = null,
  testId = undefined,
}) => {
  const { projectId } = useParams()
  const { t } = useTranslation()
  // Collect record messages carry their own status. Other forms (management regimes, GFCR) pass
  // messages without one, which take the field's type.
  const messages = validationMessages
    .map((message) => ({ ...message, status: message.status ?? validationType }))
    .filter(({ status }) => SHOWN_STATUSES.includes(status))
  const isEdited = messages.some(({ isStale }) => isStale)

  // Each warning has its own control: a Resolve button for a duplicate site or management
  // regime, otherwise an Ignore box. Once ignored, a duplicate gets the box too, to untick.
  const getAction = (message) => {
    if (message.status === 'error') {
      return null
    }

    const isIgnored = message.status === 'ignore'
    const ignore = () =>
      ignoreNonObservationFieldValidations({ validationPath, validationId: message.id })
    const unignore = () =>
      unignoreNonObservationFieldValidations({ validationPath, validationId: message.id })
    const ResolveModal = RESOLVE_MODALS[message.code]

    if (ResolveModal && !isIgnored) {
      return (
        <ResolveModal
          currentSelectValue={currentSelectValue}
          validationMessages={[message]}
          updateValueAndResetValidationForDuplicateWarning={
            updateValueAndResetValidationForDuplicateWarning
          }
          ignoreNonObservationFieldValidations={ignore}
        />
      )
    }

    return (
      <InputIgnoreValidationWarningCheckboxWithLabel
        onChange={(event) => (event.target.checked ? ignore() : unignore())}
        checked={isIgnored}
      />
    )
  }

  return (
    <ValidationWrapper data-testid={testId}>
      {messages.length ? (
        <MessageList>
          <ValidationMessageGroup
            disclosureKey={validationPath ? fieldDisclosureKey(validationPath) : undefined}
            messages={messages}
          >
            {messages.map((message) => (
              <ValidationMessage
                key={message.id}
                status={message.status}
                isStale={message.isStale}
                className={`${message.status}-indicator`}
                action={getAction(message)}
              >
                <p>{getValidationMessage(message, projectId)}</p>
              </ValidationMessage>
            ))}
          </ValidationMessageGroup>
          {isEdited ? <EditedNote>{t('validations.edited_revalidate')}</EditedNote> : null}
        </MessageList>
      ) : null}
      {additionalText}
      {validationType === 'ok' ? (
        <span aria-label={t('validations.passed')} data-testid="passed-validation-indicator">
          &nbsp;
        </span>
      ) : null}
    </ValidationWrapper>
  )
}

InputValidationInfo.propTypes = {
  ignoreNonObservationFieldValidations: PropTypes.func,
  unignoreNonObservationFieldValidations: PropTypes.func,
  validationPath: PropTypes.string,
  validationType: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  currentSelectValue: PropTypes.string,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func,
  additionalText: PropTypes.node,
  testId: PropTypes.string,
}

export default InputValidationInfo
