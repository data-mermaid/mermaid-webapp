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
    const isChecked = restOfProps.value === value

    const radioId = `${id}-${value}`

    return (
      <CheckRadioWrapper key={`key-${value}`}>
        <input type="radio" id={radioId} {...restOfProps} value={value} checked={isChecked} />
        <CheckRadioLabel htmlFor={radioId}>{optionLabel}</CheckRadioLabel>
      </CheckRadioWrapper>
    )
  })

  return (
    <InputRow validationType={validationType} data-testid={testId}>
      <div>{label}</div>
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
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

InputRadioWithLabelAndValidation.defaultProps = {
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  testId: undefined,
  validationMessages: [],
  validationType: undefined,
}

export default InputRadioWithLabelAndValidation
