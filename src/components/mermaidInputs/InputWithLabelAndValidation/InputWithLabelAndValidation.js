import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { Input, InputRow, HelperText } from '../../generic/form'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'
import InputNumberNoScrollWithUnit from '../../generic/InputNumberNoScrollWithUnit'

import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputWithLabelAndValidation = ({
  helperText,
  id,
  ignoreValidations,
  label,
  resetValidations,
  testId,
  unit,
  validationMessages,
  validationType,
  ...restOfProps
}) => {
  const textFieldRef = useRef()

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
    <InputRow validationType={validationType} data-testid={testId}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
      </label>
      <div>
        {inputType}
        {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
      </div>
      <InputValidationInfo
        validationType={validationType}
        validationMessages={validationMessages}
        ignoreValidations={ignoreValidations}
        resetValidations={resetValidations}
      />
    </InputRow>
  )
}

InputWithLabelAndValidation.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  resetValidations: PropTypes.func.isRequired,
  testId: PropTypes.string,
  unit: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

InputWithLabelAndValidation.defaultProps = {
  unit: undefined,
  helperText: undefined,
  testId: undefined,
  validationType: undefined,
  validationMessages: [],
}

export default InputWithLabelAndValidation
