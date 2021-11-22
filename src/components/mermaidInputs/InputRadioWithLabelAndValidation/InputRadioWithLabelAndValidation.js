import React from 'react'
import PropTypes from 'prop-types'

import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { InputRow, CheckRadioWrapper, CheckRadioLabel } from '../../generic/form'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputRadioWithLabelAndValidation = ({
  id,
  label,
  options,
  validationMessages,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationType,
  testId,
  ...restOfProps
}) => {
  const optionsList = options.map(({ label: optionLabel, value }) => {
    return (
      <CheckRadioWrapper key={value}>
        <input
          type="radio"
          id={value}
          {...restOfProps}
          value={value}
          checked={restOfProps.value === value}
        />
        <CheckRadioLabel htmlFor={value}>{optionLabel}</CheckRadioLabel>
      </CheckRadioWrapper>
    )
  })

  return (
    <InputRow validationType={validationType} data-testid={testId}>
      <label htmlFor={id}>{label}</label>
      <div>{optionsList}</div>
      <InputValidationInfo
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationMessages={validationMessages}
        validationType={validationType}
      />
    </InputRow>
  )
}

InputRadioWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

InputRadioWithLabelAndValidation.defaultProps = {
  testId: undefined,
  validationType: undefined,
  validationMessages: [],
}

export default InputRadioWithLabelAndValidation
