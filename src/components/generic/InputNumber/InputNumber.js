import React from 'react'
import PropTypes from 'prop-types'
import { FormGrid } from '../positioning'
import { WarningFormText } from '../text'

/**
 * Describe your component
 */

const InputNumber = ({ label, validation, ...restOfProps }) => {
  return (
    <FormGrid validation={validation}>
      <label htmlFor="input-number">{label}</label>
      <input type="number" {...restOfProps} />
      {validation !== 'ok' && (
        <WarningFormText>Warning/Error Text</WarningFormText>
      )}
    </FormGrid>
  )
}

InputNumber.propTypes = {
  label: PropTypes.string.isRequired,
  validation: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default InputNumber
