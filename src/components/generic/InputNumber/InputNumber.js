import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../positioning'

/**
 * Describe your component
 */
const InputNumberStyle = styled(Row)`
  margin: 10px;
  align-items: center;
`

const InputNumber = ({ label, ...restOfProps }) => {
  return (
    <InputNumberStyle>
      <label htmlFor="input-number">{label}</label>
      <input type="number" {...restOfProps} />
    </InputNumberStyle>
  )
}

InputNumber.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default InputNumber
