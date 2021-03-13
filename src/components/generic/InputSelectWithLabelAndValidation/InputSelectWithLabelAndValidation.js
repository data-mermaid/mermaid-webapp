import React from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'
import { InputWithValidationRow, ValidationMessage } from '../form'
import { RowCenter } from '../positioning'

const InputSelectWithLabelAndValidation = ({
  label,
  name,
  options,
  ...props
}) => {
  const optionList = options.map((item) => (
    <option key={item.name} value={item.name}>
      {item.name}
    </option>
  ))

  return (
    <InputWithValidationRow validation={meta.touched && meta.error}>
      <label htmlFor={name}>{label}</label>
      <select {...field} {...props}>
        {optionList}
      </select>
      {meta.touched && meta.error ? (
        <RowCenter>
          <ValidationMessage> {meta.error}</ValidationMessage>
        </RowCenter>
      ) : null}
    </InputWithValidationRow>
  )
}

InputSelectWithLabelAndValidation.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
}

export default InputSelectWithLabelAndValidation
