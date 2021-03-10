import React from 'react'
import PropTypes from 'prop-types'
import { FormGrid } from '../positioning'
import { WarningFormText } from '../text'
/**
 * Describe your component
 */
const InputSelect = ({ label, validation, options, ...restOfProps }) => {
  const optionList = options.map(({ name }) => (
    <option key={name} value={name}>
      {name}
    </option>
  ))

  return (
    <FormGrid validation={validation}>
      <label htmlFor="select">{label}</label>
      <select {...restOfProps}>{optionList}</select>
      {validation !== 'ok' && (
        <WarningFormText>Warning/Error Text</WarningFormText>
      )}
    </FormGrid>
  )
}

InputSelect.propTypes = {
  label: PropTypes.string.isRequired,
  validation: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
}

export default InputSelect
