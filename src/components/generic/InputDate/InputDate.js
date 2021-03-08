import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../positioning'
/**
 * Describe your component
 */
const InputDateStyle = styled(Column)`
  margin: 10px;
`

const InputDate = ({ label }) => {
  return (
    <InputDateStyle>
      <label htmlFor="input-number">{label}:</label>
      <input type="date" />
    </InputDateStyle>
  )
}

InputDate.propTypes = {}

export default InputDate
