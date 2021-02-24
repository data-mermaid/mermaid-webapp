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

const InputNumber = ({ label, value }) => {
  return (
    <InputNumberStyle>
      <label htmlFor="collect-input-number">{label}:</label>
      <input type="number" value={value} onChange={() => {}} />
    </InputNumberStyle>
  )
}

InputNumber.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

export default InputNumber
