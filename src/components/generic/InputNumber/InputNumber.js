import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../positioning'

/**
 * Describe your component
 */
const InputNumberStyle = styled(Column)`
  margin: 10px;
`

const InputNumber = ({ inputName, label, value, handleInputChange }) => {
  return (
    <InputNumberStyle>
      <label htmlFor="collect-input-number">{label}:</label>
      <input
        type="number"
        name={inputName}
        value={value}
        onChange={handleInputChange}
      />
    </InputNumberStyle>
  )
}

InputNumber.propTypes = {
  inputName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  handleInputChange: PropTypes.func.isRequired,
}

export default InputNumber
