import React from 'react'
import PropTypes from 'prop-types'

import { Textarea, InputRow, HelperText } from '../../generic/form'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'
import ValidationInfo from '../ValidationInfo/ValidationInfo'

const TextareaWithLabelAndValidation = ({
  helperText,
  id,
  ignoreValidations,
  label,
  resetValidations,
  testId,
  validationMessages,
  validationType,
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
        {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
      </div>
      <ValidationInfo
        validationType={validationType}
        validationMessages={validationMessages}
        ignoreValidations={ignoreValidations}
        resetValidations={resetValidations}
      />
    </InputRow>
  )
}

TextareaWithLabelAndValidation.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  resetValidations: PropTypes.func.isRequired,
  testId: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
  validationType: PropTypes.string,
}

TextareaWithLabelAndValidation.defaultProps = {
  helperText: undefined,
  testId: undefined,
  validationMessages: undefined,
  validationType: undefined,
}

export default TextareaWithLabelAndValidation
