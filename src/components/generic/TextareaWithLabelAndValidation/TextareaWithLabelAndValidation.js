import React from 'react'
import PropTypes from 'prop-types'

import { Textarea, InputRow, ValidationMessage } from '../form'

const TextareaWithLabelAndValidation = ({
  label,
  id,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <Textarea rows="3" id={id} {...restOfProps} />
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

TextareaWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

TextareaWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}

export default TextareaWithLabelAndValidation
