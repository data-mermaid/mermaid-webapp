import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import theme from '../../../theme'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InlineMessage from '../../generic/InlineMessage/InlineMessage'
import { getValidationMessage } from '../../../library/validationMessageHelpers'
import ResolveDuplicateSiteButtonAndModal from '../../ResolveDuplicateSiteButtonAndModal/ResolveDuplicateSiteButtonAndModal'
import ResolveDuplicateMRButtonAndModal from '../../ResolveDuplicateMRButtonAndModal/ResolveDuplicateMRButtonAndModal'
import InputIgnoreValidationWarningCheckboxWithLabel from '../InputIgnoreValidationWarningCheckboxWithLabel'

const ValidationWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.small};
  grid-column: 1 / -1;
`

const ValidationMessageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
  width: 100%;
`

const ValidationMessageWithIcon = styled('div')`
  display: flex;
  gap: ${theme.spacing.medium};
  align-items: baseline;
`

const CheckboxContainer = styled('div')`
  margin-top: ${theme.spacing.xsmall};
`

const InputValidationInfo = ({
  ignoreNonObservationFieldValidations = () => {},
  resetNonObservationFieldValidations = () => {},
  validationMessages = [],
  validationType = undefined,
  currentSelectValue = undefined,
  updateValueAndResetValidationForDuplicateWarning = () => {},
  additionalText = null,
}) => {
  const { projectId } = useParams()
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
    <ValidationWrapper>
      {areThereValidationMessages &&
      (isErrorValidation || isWarningValidation || isIgnoredWarningValidation) ? (
        <ValidationMessageContainer>
          {validationMessages.map((validation) => (
            <ValidationMessageWithIcon key={validation.id}>
              <InlineMessage type={validationType} className={`${validationType}-indicator`}>
                <p>{getValidationMessage(validation, projectId)}</p>
              </InlineMessage>
            </ValidationMessageWithIcon>
          ))}
          {(isWarningValidation || isIgnoredWarningValidation) && (
            <CheckboxContainer>{getWarningValidationButtons()}</CheckboxContainer>
          )}
        </ValidationMessageContainer>
      ) : null}
      {additionalText}
      {isValidationPassing ? <span aria-label="Passed Validation">&nbsp;</span> : null}
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
}

export default InputValidationInfo
