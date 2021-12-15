import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'
import theme from '../../../theme'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InlineMessage from '../../generic/InlineMessage/InlineMessage'
import { InlineValidationButton } from '../../pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo'

const ValidationWrapper = styled('div')`
  padding-left: ${theme.spacing.small};
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
            <InlineMessage type={validationType} key={validationMessage.id}>
              <p>{validationMessage.message}</p>
              {areThereValidationMessages && validationType === 'warning' ? (
                <InlineValidationButton
                  type="button"
                  onClick={ignoreNonObservationFieldValidations}
                >
                  Ignore all warnings
                </InlineValidationButton>
              ) : null}
            </InlineMessage>
          ))}
        </>
      ) : null}
      {validationType === 'ok' ? <span aria-label="Passed validation">&nbsp;</span> : null}
      {validationType === 'ignore' ? (
        <>
          <InlineMessage validationType={validationType}>
            Ignored
            <InlineValidationButton type="button" onClick={resetNonObservationFieldValidations}>
              Reset validations
            </InlineValidationButton>
          </InlineMessage>
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
}

InputValidationInfo.defaultProps = {
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  validationMessages: [],
  validationType: undefined,
}

export default InputValidationInfo
