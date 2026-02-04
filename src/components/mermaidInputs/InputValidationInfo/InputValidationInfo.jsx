import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import theme from '../../../theme'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InlineMessage from '../../generic/InlineMessage/InlineMessage'
import { getValidationMessage } from '../../../library/validationMessageHelpers'
import ResolveDuplicateSiteButtonAndModal from '../../ResolveDuplicateSiteButtonAndModal/ResolveDuplicateSiteButtonAndModal'
import ResolveDuplicateMRButtonAndModal from '../../ResolveDuplicateMRButtonAndModal/ResolveDuplicateMRButtonAndModal'
import InputIgnoreValidationWarningCheckboxWithLabel from '../InputIgnoreValidationWarningCheckboxWithLabel'

const ValidationWrapper = styled('div')`
  padding-left: ${theme.spacing.small};
  display: flex;
  align-items: flex-start;
`

const InputValidationInfo = ({
  ignoreNonObservationFieldValidations = () => {},
  resetNonObservationFieldValidations = () => {},
  validationMessages = [],
  validationType = undefined,
  currentSelectValue = undefined,
  updateValueAndResetValidationForDuplicateWarning = () => {},
  additionalText = null,
  testId = undefined,
}) => {
  const { projectId } = useParams()
  const { t } = useTranslation()
  const areThereValidationMessages = validationMessages.length
  const isWarningValidation = areThereValidationMessages && validationType === 'warning'
  const isIgnoredWarningValidation = validationType === 'ignore'
  const isErrorValidation = validationType === 'error'
  const isValidationPassing = validationType === 'ok'

  const handleIgnoreWarningChange = async (event) => {
    const isIgnoreChecked = event.target.checked

    if (isIgnoreChecked) {
      ignoreNonObservationFieldValidations()
    }
    if (!isIgnoreChecked) {
      resetNonObservationFieldValidations()
    }
  }

  const getWarningValidationButtons = () => {
    if (validationMessages[0]?.code === 'not_unique_site') {
      return (
        <ResolveDuplicateSiteButtonAndModal
          currentSelectValue={currentSelectValue}
          validationMessages={validationMessages}
          updateValueAndResetValidationForDuplicateWarning={
            updateValueAndResetValidationForDuplicateWarning
          }
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        />
      )
    }

    if (validationMessages[0]?.code === 'similar_name') {
      return (
        <ResolveDuplicateMRButtonAndModal
          currentSelectValue={currentSelectValue}
          validationMessages={validationMessages}
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
      {areThereValidationMessages &&
      (isErrorValidation || isWarningValidation || isIgnoredWarningValidation) ? (
        <>
          {validationMessages.map((validation) => (
            <InlineMessage
              type={validationType}
              key={validation.id}
              className={`${validationType}-indicator`}
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
  resetNonObservationFieldValidations: PropTypes.func,
  validationType: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  currentSelectValue: PropTypes.string,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func,
  additionalText: PropTypes.node,
  testId: PropTypes.string,
}

export default InputValidationInfo
