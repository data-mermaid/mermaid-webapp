import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../positioning'

/**
 * Describe your component
 */
const InputTimeStyle = styled(Column)`
  margin: 10px;
`

const InputTime = ({ label }) => {
  return (
    <InputTimeStyle>
      <label htmlFor="input-time">{label}:</label>
      <input type="time" />
    </InputTimeStyle>
  )
}

InputTime.propTypes = {
  label: PropTypes.string.isRequired,
}

export default InputTime
