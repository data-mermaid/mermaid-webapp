import React from 'react'
import PropTypes from 'prop-types'

import { Textarea, InputRow, ValidationMessage, HelperText } from '../form'
import { IconCheck } from '../../icons'

const TextareaWithLabelAndValidation = ({
  label,
  id,
  helperText,
  validationMessage,
  validationType,
  testId,
  ...restOfProps
}) => {
  return (
    <InputRow validationType={validationType} data-testid={testId}>
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
        {validationMessage &&
        (validationType === 'error' || validationType === 'warning') ? (
          <ValidationMessage validationType={validationType}>
            {validationMessage}
          </ValidationMessage>
        ) : null}
        {validationType === 'ok' ? (
          <IconCheck aria-label="Passed validation" />
        ) : null}
      </div>
    </InputRow>
  )
}

TextareaWithLabelAndValidation.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  testId: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  validationType: PropTypes.string,
}

TextareaWithLabelAndValidation.defaultProps = {
  helperText: undefined,
  testId: undefined,
  validationMessage: undefined,
  validationType: undefined,
}

export default TextareaWithLabelAndValidation
