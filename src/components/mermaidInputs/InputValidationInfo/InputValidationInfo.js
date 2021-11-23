import React from 'react'
import PropTypes from 'prop-types'
import { ValidationMessage } from '../../generic/form'
import { Column } from '../../generic/positioning'
import { IconCheck } from '../../icons'
import { ButtonSecondary } from '../../generic/buttons'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputValidationInfo = ({
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationMessages,
  validationType,
}) => {
  const areThereValidationMessages = validationMessages.length

  return (
    <Column>
      {areThereValidationMessages &&
      (validationType === 'error' || validationType === 'warning') ? (
        <Column>
          {validationMessages.map((validationMessage) => (
            <ValidationMessage validationType={validationType} key={validationMessage.id}>
              {validationMessage.message}
            </ValidationMessage>
          ))}
        </Column>
      ) : null}
      {validationType === 'ok' ? <IconCheck aria-label="Passed validation" /> : null}
      {validationType === 'ignore' ? (
        <Column>
          <ValidationMessage validationType={validationType}>Ignored</ValidationMessage>
          <ButtonSecondary type="button" onClick={resetNonObservationFieldValidations}>
            Reset validations
          </ButtonSecondary>
        </Column>
      ) : null}

      {areThereValidationMessages && validationType === 'warning' ? (
        <ButtonSecondary type="button" onClick={ignoreNonObservationFieldValidations}>
          Ignore all warnings
        </ButtonSecondary>
      ) : null}
    </Column>
  )
}

InputValidationInfo.propTypes = {
  ignoreNonObservationFieldValidations: PropTypes.func,
  resetNonObservationFieldValidations: PropTypes.func,
  validationType: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
}

InputValidationInfo.defaultProps = {
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  validationMessages: [],
  validationType: undefined,
}

export default InputValidationInfo
