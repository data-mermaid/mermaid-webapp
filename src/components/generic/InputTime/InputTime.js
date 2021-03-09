import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../positioning'

/**
 * Describe your component
 */
const InputTimeStyle = styled(Row)`
  margin: 10px;
  align-items: center;
`

const InputTime = ({ label }) => {
  return (
    <InputTimeStyle>
      <label htmlFor="input-time">{label}</label>
      <input type="time" />
    </InputTimeStyle>
  )
}

InputTime.propTypes = {
  label: PropTypes.string.isRequired,
}

export default InputTime
