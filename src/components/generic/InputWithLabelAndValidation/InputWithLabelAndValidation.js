import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { Input, InputRow, ValidationMessage } from '../form'
import { useNoInputScrolling } from '../../../library/useNoInputScrolling'

const InputWithLabelAndValidation = ({
  label,
  id,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const textFieldRef = useRef()

  useNoInputScrolling(textFieldRef)

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <Input id={id} {...restOfProps} ref={textFieldRef} />
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
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}

export default InputWithLabelAndValidation
