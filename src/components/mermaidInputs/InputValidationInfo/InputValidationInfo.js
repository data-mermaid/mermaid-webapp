import React from 'react'
import styled, { css } from 'styled-components/macro'
import PropTypes from 'prop-types'
import { ValidationMessage } from '../../generic/form'
import theme from '../../../theme'
import { ButtonSecondary } from '../../generic/buttons'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const validationStyles = css`
  padding: ${theme.spacing.xxsmall} ${theme.spacing.xsmall};
  margin: ${theme.spacing.xsmall} ${theme.spacing.xxsmall};
  display: block;
`

const ValidationButton = styled(ButtonSecondary)`
  ${validationStyles};
  text-transform: capitalize;
`
const FormValidationMessage = styled(ValidationMessage)`
  ${validationStyles}
`
const ValidationWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-start;
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
        <>
          {validationMessages.map((validationMessage) => (
            <FormValidationMessage validationType={validationType} key={validationMessage.id}>
              {validationMessage.message}
            </FormValidationMessage>
          ))}
        </>
      ) : null}
      {validationType === 'ok' ? <span aria-label="Passed validation">&nbsp;</span> : null}
      {validationType === 'ignore' ? (
        <>
          <FormValidationMessage validationType={validationType}>Ignored</FormValidationMessage>
          <ValidationButton type="button" onClick={resetNonObservationFieldValidations}>
            Reset validations
          </ValidationButton>
        </>
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
