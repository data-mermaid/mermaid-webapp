import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'
import theme from '../../../theme'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InlineMessage from '../../generic/InlineMessage/InlineMessage'
import { InlineValidationButton } from '../../pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo'
import language from '../../../language'
import ResolveDuplicateSiteButtonAndModal from '../../ResolveDuplicateSiteButtonAndModal/ResolveDuplicateSiteButtonAndModal'
import ResolveDuplicateMRButtonAndModal from '../../ResolveDuplicateMRButtonAndModal/ResolveDuplicateMRButtonAndModal'

const ValidationWrapper = styled('div')`
  padding-left: ${theme.spacing.small};
  display: flex;
  align-items: flex-start;
`

const InputValidationInfo = ({
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationMessages,
  validationType,
  currentSelectValue,
  updateValueAndResetValidationForDuplicateWarning,
}) => {
  const areThereValidationMessages = validationMessages.length
  const isWarningValidation = areThereValidationMessages && validationType === 'warning'

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

    if (
      validationMessages[0]?.code === 'not_unique_management' ||
      validationMessages[0]?.code === 'similar_name'
    ) {
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
      <InlineValidationButton type="button" onClick={ignoreNonObservationFieldValidations}>
        Ignore warning
      </InlineValidationButton>
    )
  }

  return (
    <ValidationWrapper>
      {areThereValidationMessages &&
      (validationType === 'error' || validationType === 'warning') ? (
        <>
          {validationMessages.map((validation) => (
            <InlineMessage
              type={validationType}
              key={validation.id}
              className={`${validationType}-indicator`}
            >
              <p>{language.getValidationMessage(validation)}</p>
            </InlineMessage>
          ))}
        </>
      ) : null}
      {isWarningValidation ? getWarningValidationButtons() : null}
      {validationType === 'ok' ? <span aria-label="Passed Validation">&nbsp;</span> : null}
      {validationType === 'ignore' ? (
        <>
          <InlineMessage type={validationType}>
            <p>Ignored</p>
          </InlineMessage>
          <InlineValidationButton type="button" onClick={resetNonObservationFieldValidations}>
            Reset validations
          </InlineValidationButton>
        </>
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
}

InputValidationInfo.defaultProps = {
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  validationMessages: [],
  validationType: undefined,
  currentSelectValue: undefined,
  updateValueAndResetValidationForDuplicateWarning: () => {},
}

export default InputValidationInfo
