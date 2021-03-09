import React from 'react'
import PropTypes from 'prop-types'
import { FormGrid } from '../positioning'
import { WarningFormText } from '../text'

/**
 * Describe your component
 */

const InputTime = ({ label, validation }) => {
  return (
    <FormGrid validation={validation}>
      <label htmlFor="input-time">{label}</label>
      <input type="time" />
      {validation !== 'ok' && (
        <WarningFormText>Warning/Error Text</WarningFormText>
      )}
    </FormGrid>
  )
}

InputTime.propTypes = {
  label: PropTypes.string.isRequired,
}

export default InputTime
