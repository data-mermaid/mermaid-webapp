import React from 'react'
import PropTypes from 'prop-types'

import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { InputRow, CheckRadioWrapper, CheckRadioLabel, RequiredIndicator } from '../../generic/form'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputRadioWithLabelAndValidation = ({
  required = false,
  id,
  label,
  options,
  validationMessages = [],
  ignoreNonObservationFieldValidations = () => {},
  resetNonObservationFieldValidations = () => {},
  validationType = undefined,
  testId = undefined,
  additionalText = null,
  ...restOfProps
}) => {
  const optionsList = options.map(({ label: optionLabel, value: optionValue }) => {
    const isChecked = restOfProps.value === optionValue

    const radioId = `${id}-${optionValue}`

    return (
      <CheckRadioWrapper key={`key-${optionValue}`}>
        <input type="radio" id={radioId} {...restOfProps} value={optionValue} checked={isChecked} />
        <CheckRadioLabel htmlFor={radioId}>{optionLabel}</CheckRadioLabel>
      </CheckRadioWrapper>
    )
  })

  return (
    <InputRow required={required} $validationType={validationType} data-testid={testId}>
      <label id={`${id}-input-radio-with-label-and-validation`}>
        {label}
        {required ? <RequiredIndicator /> : null}
      </label>
      <div aria-labelledby={`${id}-input-radio-with-label-and-validation`}>{optionsList}</div>
      <InputValidationInfo
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationMessages={validationMessages}
        validationType={validationType}
        additionalText={additionalText}
      />
    </InputRow>
  )
}

InputRadioWithLabelAndValidation.propTypes = {
  required: PropTypes.bool,
  id: PropTypes.string.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
  additionalText: PropTypes.node,
}

export default InputRadioWithLabelAndValidation
