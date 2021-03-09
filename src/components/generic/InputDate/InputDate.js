import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {  Row } from '../positioning'
/**
 * Describe your component
 */
const InputDateStyle = styled(Row)`
  margin: 10px;
  align-items: center;
`

const InputDate = ({ label }) => {
  return (
    <InputDateStyle>
      <label htmlFor="input-date">{label}</label>
      <input type="date" />
    </InputDateStyle>
  )
}

InputDate.propTypes = {
  label: PropTypes.string.isRequired,
}

export default InputDate
