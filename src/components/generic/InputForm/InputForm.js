import React from 'react'
import PropTypes from 'prop-types'
import { FormGrid } from '../positioning'
import { WarningFormText } from '../text'

/**
 * Describe your component
 */
const InputForm = ({ type, label, validation, options, ...restOfProps }) => {
  const optionList =
    type === 'select' &&
    options.map(({ name }) => (
      <option key={name} value={name}>
        {name}
      </option>
    ))

  const inputType =
    type === 'select' ? (
      <select {...restOfProps}>{optionList}</select>
    ) : (
      <input type={type} {...restOfProps} />
    )

  return (
    <FormGrid validation={validation}>
      <label htmlFor={type}>{label}</label>
      {inputType}
      {validation !== 'ok' && (
        <WarningFormText>Warning/Error Text</WarningFormText>
      )}
    </FormGrid>
  )
}

InputForm.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  validation: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
}

export default InputForm
