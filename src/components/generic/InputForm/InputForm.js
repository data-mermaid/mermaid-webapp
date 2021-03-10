import React from 'react'
import PropTypes from 'prop-types'
import { FormGrid } from '../positioning'
import { WarningFormText } from '../text'

/**
 * Describe your component
 */
const InputForm = ({ type, label, validation, ...restOfProps }) => {
  return (
    <FormGrid validation={validation}>
      <label htmlFor={type}>{label}</label>
      <input type={type} {...restOfProps} />
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
}

export default InputForm
