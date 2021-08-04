import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { Input, InputRow, HelperText, ValidationMessage } from '../form'
import InputNumberNoScrollWithUnit from '../InputNumberNoScrollWithUnit'
import { useStopInputScrollingIncrementNumber } from '../../../library/useStopInputScrollingIncrementNumber'

const InputWithLabelAndValidation = ({
  label,
  helperText,
  id,
  unit,
  validationMessage,
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
    <InputRow validationType={validationType}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
      </label>
      <div>
        {inputType}
        {helperText && (
          <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>
        )}
      </div>
      <div>
        {validationMessage ? (
          <ValidationMessage validationType={validationType}>
            {validationMessage}
          </ValidationMessage>
        ) : null}
      </div>
    </InputRow>
  )
}

InputWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  helperText: PropTypes.string,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputWithLabelAndValidation.defaultProps = {
  unit: undefined,
  helperText: undefined,
  validationType: undefined,
  validationMessage: undefined,
}

export default InputWithLabelAndValidation
