import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { InputRow, ValidationMessage } from '../form'

const InputRadioWithLabelAndValidation = ({
  id,
  label,
  options,
  validationMessage,
  validationType,
  ...restOfProps
}) => {
  const optionList = (field) =>
    options.map(({ label: optionLabel, value }) => {
      return (
        <div key={value}>
          <input
            type="radio"
            id={value}
            {...field}
            value={value}
            checked={field.value === value}
          />
          <label htmlFor={value}>{optionLabel}</label>
        </div>
      )
    })

  const validationRole =
    validationType === 'error' || 'warning' ? 'alert' : undefined

  return (
    <InputRow>
      <label htmlFor={id}>{label}</label>
      <div>
        <Field name={id}>{() => optionList(restOfProps)}</Field>
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
