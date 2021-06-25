import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { Input, InputRow, ValidationMessage } from '../form'
import InputNumberNoScrollWithUnit from '../InputNumberNoScrollWithUnit'
import { useNoInputScrolling } from '../../../library/useNoInputScrolling'

const InputWithLabelAndValidation = ({
  label,
  id,
  unit,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const textFieldRef = useRef()

  useNoInputScrolling(textFieldRef)

  const inputType = unit ? (
    <InputNumberNoScrollWithUnit id={id} unit={unit} {...restOfProps} />
  ) : (
    <Input id={id} {...restOfProps} ref={textFieldRef} />
  )

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      {inputType}
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
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputWithLabelAndValidation.defaultProps = {
  unit: undefined,
  validationType: undefined,
  validationMessage: undefined,
}

export default InputWithLabelAndValidation
