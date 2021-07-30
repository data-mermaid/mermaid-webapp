import React from 'react'
import PropTypes from 'prop-types'
import { InputRow, ValidationMessage } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'

const InputRadioWithLabelAndValidation = ({
  id,
  label,
  options,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const optionsList = options.map(({ label: optionLabel, value }) => {
    return (
      <div key={value}>
        <input
          type="radio"
          id={value}
          name={optionLabel}
          {...restOfProps}
          value={value}
          checked={restOfProps.value === value}
        />
        <label htmlFor={value}>{optionLabel}</label>
      </div>
    )
  })

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <div>{optionsList}</div>
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
  options: inputOptionsPropTypes.isRequired,
  validationType: PropTypes.string,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

InputRadioWithLabelAndValidation.defaultProps = {
  validationType: undefined,
  validationMessage: undefined,
}

export default InputRadioWithLabelAndValidation
