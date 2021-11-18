import React from 'react'
import PropTypes from 'prop-types'
import { InputRow, Select, HelperText } from '../../generic/form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'

import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputSelectWithLabelAndValidation = ({
  label,
  id,
  options,
  helperText,
  validationMessages,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationType,
  testId,
  ...restOfProps
}) => {
  const optionList = options.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))

  return (
    <InputRow validationType={validationType} data-testid={testId}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
      </label>
      <div>
        <Select
          aria-labelledby={`aria-label${id}`}
          aria-describedby={`aria-descp${id}`}
          id={id}
          {...restOfProps}
        >
          <option value="" disabled>
            Choose...
          </option>
          {optionList}
        </Select>
        {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
      </div>
      <InputValidationInfo
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationMessages={validationMessages}
        validationType={validationType}
      />
    </InputRow>
  )
}

InputSelectWithLabelAndValidation.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

InputSelectWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessages: [],
  helperText: undefined,
  testId: undefined,
}
export default InputSelectWithLabelAndValidation
