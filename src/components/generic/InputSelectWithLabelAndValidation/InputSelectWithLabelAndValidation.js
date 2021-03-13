import React from 'react'
import PropTypes from 'prop-types'
import { InputWithValidationRow, ValidationMessage } from '../form'
import { RowCenter } from '../positioning'

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

  return (
    <InputWithValidationRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <select id={id} {...restOfProps}>
        {optionList}
      </select>
      {validationMessage ? (
        <RowCenter>
          <ValidationMessage validationType={validationType}>
            {validationMessage}
          </ValidationMessage>
        </RowCenter>
      ) : null}
    </InputWithValidationRow>
  )
}

InputSelectWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputSelectWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}
export default InputSelectWithLabelAndValidation
