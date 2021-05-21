import React from 'react'
import PropTypes from 'prop-types'
import { InputRow, ValidationMessage } from '../form'

const InputRadioWithLabelAndValidation = ({
  id,
  label,
  options,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const optionsList = (field) => {
    return options.map(({ label: optionLabel, value }) => {
      return (
        <div key={value}>
          <input
            type="radio"
            {...field}
            value={value}
            checked={field.value === value}
          />
          <label htmlFor={value}>{optionLabel}</label>
        </div>
      )
    })
  }

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <div>{optionsList(restOfProps)}</div>
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

InputRadioWithLabelAndValidation.propTypes = {
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

InputRadioWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}

export default InputRadioWithLabelAndValidation
