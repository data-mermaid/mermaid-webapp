import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../positioning'
/**
 * Describe your component
 */

const SelectInputStyle = styled(Column)`
  margin: 10px;
`

const InputSelect = ({ label, options }) => {
  const optionList = options.map(({ name }) => (
    <option key={name} value={name}>
      {name}
    </option>
  ))

  return (
    <SelectInputStyle id="mermaid-select">
      <label htmlFor="mermaid-select">{label}:</label>
      <select>{optionList}</select>
    </SelectInputStyle>
  )
}

InputSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
}

export default InputSelect
