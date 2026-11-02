import React from 'react'
import { styled } from 'styled-components'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import theme from '../../../theme'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InlineMessage from '../../generic/InlineMessage/InlineMessage'
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

const InputValidationInfo = ({
  ignoreNonObservationFieldValidations = () => {},
  unignoreNonObservationFieldValidations = () => {},
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
  const messages = validationMessages.map((message) => ({
    ...message,
    status: message.status ?? validationType,
  }))
  const areThereValidationMessages = messages.length
  // A field can show an error and a warning together, so the warning controls follow the
  // field's warnings rather than its overall type. It counts as ignored only when none of its
  // warnings are still showing.
  const isValidationShowing =
    validationType === 'error' || validationType === 'warning' || validationType === 'ignore'
  const warningMessages = messages.filter(
    ({ status }) => status === 'warning' || status === 'ignore',
  )
  const isWarningValidation =
    isValidationShowing && warningMessages.some(({ status }) => status === 'warning')
  const isIgnoredWarningValidation =
    isValidationShowing && warningMessages.length > 0 && !isWarningValidation
  const isValidationPassing = validationType === 'ok'

  const handleIgnoreWarningChange = async (event) => {
    const isIgnoreChecked = event.target.checked

    if (isIgnoreChecked) {
      ignoreNonObservationFieldValidations()
    }
    if (!isIgnoreChecked) {
      unignoreNonObservationFieldValidations()
    }
  }

  const getWarningValidationButtons = () => {
    if (warningMessages[0]?.code === 'not_unique_site') {
      return (
        <ResolveDuplicateSiteButtonAndModal
          currentSelectValue={currentSelectValue}
          validationMessages={warningMessages}
          updateValueAndResetValidationForDuplicateWarning={
            updateValueAndResetValidationForDuplicateWarning
          }
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        />
      )
    }

    if (warningMessages[0]?.code === 'similar_name') {
      return (
        <ResolveDuplicateMRButtonAndModal
          currentSelectValue={currentSelectValue}
          validationMessages={warningMessages}
          updateValueAndResetValidationForDuplicateWarning={
            updateValueAndResetValidationForDuplicateWarning
          }
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        />
      )
    }

    return (
      <InputIgnoreValidationWarningCheckboxWithLabel
        onChange={handleIgnoreWarningChange}
        checked={isIgnoredWarningValidation}
      />
    )
  }

  return (
    <ValidationWrapper data-testid={testId}>
      {areThereValidationMessages && isValidationShowing ? (
        <>
          {messages.map((validation) => (
            <InlineMessage
              type={validation.status}
              key={validation.id}
              className={`${validation.status}-indicator`}
            >
              <p>{getValidationMessage(validation, projectId)}</p>
            </InlineMessage>
          ))}
        </>
      ) : null}
      {additionalText}
      {isWarningValidation || isIgnoredWarningValidation ? getWarningValidationButtons() : null}
      {isValidationPassing ? (
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
  validationType: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  currentSelectValue: PropTypes.string,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func,
  additionalText: PropTypes.node,
  testId: PropTypes.string,
}

export default InputValidationInfo
