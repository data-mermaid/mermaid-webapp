import React from 'react'
import PropTypes from 'prop-types'
import { FormGrid } from '../positioning'
import { WarningFormText } from '../text'
/**
 * Describe your component
 */

const InputDate = ({ label, validation }) => {
  return (
    <FormGrid validation={validation}>
      <label htmlFor="input-date">{label}</label>
      <input type="date" />
      {validation !== 'ok' && (
        <WarningFormText>Warning/Error Text</WarningFormText>
      )}
    </FormGrid>
  )
}

InputDate.propTypes = {
  label: PropTypes.string.isRequired,
  validation: PropTypes.string.isRequired,
}

export default InputDate
