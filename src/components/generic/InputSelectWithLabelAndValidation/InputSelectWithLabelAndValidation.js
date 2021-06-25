import React from 'react'
import PropTypes from 'prop-types'
import { InputRow, Select, ValidationMessage } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'

const InputSelectWithLabelAndValidation = ({
  label,
  id,
  options,
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
      <label htmlFor={id}>{label}</label>
      <Select id={id} {...restOfProps}>
        <option value="" disabled>
          Choose...
        </option>
        {optionList}
      </Select>
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
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputSelectWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}
export default InputSelectWithLabelAndValidation
