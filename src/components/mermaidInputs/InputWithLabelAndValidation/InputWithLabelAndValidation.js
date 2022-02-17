import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { Input, InputRow, HelperText } from '../../generic/form'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'
import InputNumberNoScrollWithUnit from '../../generic/InputNumberNoScrollWithUnit'

import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputWithLabelAndValidation = ({
  required,
  helperText,
  id,
  ignoreNonObservationFieldValidations,
  label,
  resetNonObservationFieldValidations,
  testId,
  unit,
  validationMessages,
  validationType,
  initialValue,
  resetInputDirty,
  ...restOfProps
}) => {
  const textFieldRef = useRef()
  const { value } = restOfProps

  const validationTypeCondition = resetInputDirty && initialValue !== value ? null : validationType

  useStopInputScrollingIncrementNumber(textFieldRef)

  const inputType = unit ? (
    <InputNumberNoScrollWithUnit
      aria-labelledby={`aria-label${id}`}
      aria-describedby={`aria-descp${id}`}
      id={id}
      unit={unit}
      {...restOfProps}
    />
  ) : (
    <Input
      aria-labelledby={`aria-label${id}`}
      aria-describedby={`aria-descp${id}`}
      id={id}
      {...restOfProps}
      ref={textFieldRef}
    />
  )

  return (
    <InputRow required={required} validationType={validationTypeCondition} data-testid={testId}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
      </label>
      <div>
        {inputType}
        {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
      </div>
      <InputValidationInfo
        validationType={validationTypeCondition}
        validationMessages={validationMessages}
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
      />
    </InputRow>
  )
}

InputWithLabelAndValidation.propTypes = {
  required: PropTypes.bool,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
  testId: PropTypes.string,
  unit: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  resetInputDirty: PropTypes.bool,
}

InputWithLabelAndValidation.defaultProps = {
  required: false,
  helperText: undefined,
  ignoreNonObservationFieldValidations: () => {},
  resetNonObservationFieldValidations: () => {},
  testId: undefined,
  unit: undefined,
  validationMessages: [],
  validationType: undefined,
  initialValue: undefined,
  resetInputDirty: false,
}

export default InputWithLabelAndValidation
