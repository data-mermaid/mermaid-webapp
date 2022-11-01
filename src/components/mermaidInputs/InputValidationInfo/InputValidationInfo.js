import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'
import theme from '../../../theme'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InlineMessage from '../../generic/InlineMessage/InlineMessage'
import { InlineValidationButton } from '../../pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo'
import language from '../../../language'

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
}) => {
  const areThereValidationMessages = validationMessages.length

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
      {areThereValidationMessages && validationType === 'warning' ? (
        <InlineValidationButton type="button" onClick={ignoreNonObservationFieldValidations}>
          Ignore warning
        </InlineValidationButton>
      ) : null}
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
}

InputValidationInfo.defaultProps = {
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  validationMessages: [],
  validationType: undefined,
}

export default InputValidationInfo
