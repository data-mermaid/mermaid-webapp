import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'
import { ValidationMessage, ValidationCheckMark } from '../../generic/form'
import theme from '../../../theme'
import { ButtonSecondary } from '../../generic/buttons'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const ValidationButton = styled(ButtonSecondary)`
  font-size: smaller;
  padding: ${theme.spacing.xxsmall} ${theme.spacing.xsmall};
  margin: ${theme.spacing.xsmall};
  text-transform: capitalize;
`
const ValidationWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
`
const InputValidationInfo = ({
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationMessages,
  validationType,
}) => {
  const areThereValidationMessages = validationMessages.length

  return (
    <ValidationWrapper>
      {areThereValidationMessages &&
      (validationType === 'error' || validationType === 'warning') ? (
        <div>
          {validationMessages.map((validationMessage) => (
            <ValidationMessage validationType={validationType} key={validationMessage.id}>
              {validationMessage.message}
            </ValidationMessage>
          ))}
        </div>
      ) : null}
      {validationType === 'ok' ? <ValidationCheckMark aria-label="Passed validation" /> : null}
      {validationType === 'ignore' ? (
        <div>
          <ValidationMessage validationType={validationType}>Ignored</ValidationMessage>
          <ValidationButton type="button" onClick={resetNonObservationFieldValidations}>
            Reset validations
          </ValidationButton>
        </div>
      ) : null}

      {areThereValidationMessages && validationType === 'warning' ? (
        <ValidationButton type="button" onClick={ignoreNonObservationFieldValidations}>
          Ignore all warnings
        </ValidationButton>
      ) : null}
    </ValidationWrapper>
  )
}

InputValidationInfo.propTypes = {
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationType: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
}

InputValidationInfo.defaultProps = {
  validationType: undefined,
  validationMessages: [],
}

export default InputValidationInfo
