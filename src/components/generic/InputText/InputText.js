import React from 'react'
import PropTypes from 'prop-types'
import { FormGrid } from '../positioning'
import { WarningFormText } from '../text'

/**
 * Describe your component
 */

const InputText = ({ label, validation }) => {
  return (
    <FormGrid validation={validation}>
      <label htmlFor="input-text">{label}</label>
      <input type="text" />
      {validation !== 'ok' && (
        <WarningFormText>Warning/Error Text</WarningFormText>
      )}
    </FormGrid>
  )
}

InputText.propTypes = {
  label: PropTypes.string.isRequired,
}

export default InputText
