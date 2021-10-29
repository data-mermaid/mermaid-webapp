import React from 'react'
import PropTypes from 'prop-types'
import { InputRow, Select, ValidationMessage, HelperText } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { IconCheck } from '../../icons'

const InputSelectWithLabelAndValidation = ({
  label,
  id,
  options,
  helperText,
  validationMessage,
  validationType,
  testId,
  ...restOfProps
}) => {
  const optionList = options.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))

  return (
    <InputRow validationType={validationType} data-testid={testId}>
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

InputSelectWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: inputOptionsPropTypes.isRequired,
  validationType: PropTypes.string,
  helperText: PropTypes.string,
  testId: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputSelectWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
  helperText: undefined,
  testId: undefined,
}
export default InputSelectWithLabelAndValidation
