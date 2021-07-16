import React from 'react'
import PropTypes from 'prop-types'

import { Textarea, InputRow, ValidationMessage, HelperText } from '../form'

const TextareaWithLabelAndValidation = ({
  label,
  id,
  helperText,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  return (
    <InputRow validationType={validationType}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
      </label>
      <div>
        <Textarea
          aria-labelledby={`aria-label${id}`}
          aria-describedby={`aria-descp${id}`}
          rows="3"
          id={id}
          {...restOfProps}
        />
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
