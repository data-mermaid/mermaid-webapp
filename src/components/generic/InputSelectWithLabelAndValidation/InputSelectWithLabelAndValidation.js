import React from 'react'
import PropTypes from 'prop-types'
import { InputRow, Select, ValidationMessage, HelperText } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'

const InputSelectWithLabelAndValidation = ({
  label,
  id,
  options,
  helperText,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const optionList = options.map((item) => (
    <option key={item.label} value={item.value}>
      {item.label}
    </option>
  ))

  const validationRole =
    validationType === 'error' || 'warning' ? 'alert' : undefined

  return (
    <InputRow validationType={validationType}>
      <label id={`aria-label${id}`} htmlFor={id}>
        {label}
      </label>
      <div>
        <Select
          aria-labelledby={`aria-label${id}`}
          aria-describedby={`aria-descp${id}`}
          id={id}
          {...restOfProps}
        >
          <option value="" disabled>
            Choose...
          </option>
          {optionList}
        </Select>
        {helperText && (
          <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>
        )}
      </div>
      <div>
        {validationMessage ? (
          <ValidationMessage
            validationType={validationType}
            role={validationRole}
          >
            {validationMessage}
          </ValidationMessage>
        ) : null}
      </div>
    </InputRow>
  )
}

InputSelectWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  validationType: PropTypes.string,
  helperText: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputSelectWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
  helperText: undefined,
}
export default InputSelectWithLabelAndValidation
