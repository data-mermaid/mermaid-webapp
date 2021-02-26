import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../positioning'
/**
 * Describe your component
 */

const InputSelectStyle = styled(Column)`
  margin: 10px;
`

const InputSelect = ({
  inputName,
  label,
  options,
  value,
  handleInputChange,
}) => {
  const optionList = options.map(({ name }) => (
    <option key={name} value={name}>
      {name}
    </option>
  ))

  return (
    <InputSelectStyle id="mermaid-select">
      <label htmlFor="mermaid-select">{label}:</label>
      <select name={inputName} value={value} onChange={handleInputChange}>
        {optionList}
      </select>
    </InputSelectStyle>
  )
}

InputSelect.propTypes = {
  inputName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
}

export default InputSelect
