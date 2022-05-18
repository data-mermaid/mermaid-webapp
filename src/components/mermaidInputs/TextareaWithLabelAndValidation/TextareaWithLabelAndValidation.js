import React from 'react'
import PropTypes from 'prop-types'

import { Textarea, InputRow, HelperText, RequiredIndicator } from '../../generic/form'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'

const TextareaWithLabelAndValidation = ({
  helperText,
  required,
  id,
  ignoreNonObservationFieldValidations,
  label,
  resetNonObservationFieldValidations,
  testId,
  validationMessages,
  validationType,
  ...restOfProps
}) => {
  return (
    <InputRow validationType={validationType} data-testid={testId}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
        {required ? <RequiredIndicator /> : null}
      </label>
      <div>
        <Textarea
          aria-labelledby={`aria-label${id}`}
          aria-describedby={`aria-descp${id}`}
          rows="6"
          id={id}
          {...restOfProps}
        />
        {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
      </div>
      <InputValidationInfo
        validationType={validationType}
        validationMessages={validationMessages}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
      />
    </InputRow>
  )
}

TextareaWithLabelAndValidation.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

TextareaWithLabelAndValidation.defaultProps = {
  helperText: undefined,
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  testId: undefined,
  validationMessages: undefined,
  validationType: undefined,
}

export default TextareaWithLabelAndValidation
