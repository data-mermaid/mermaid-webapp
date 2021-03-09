import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../positioning'

/**
 * Describe your component
 */

const InputTextStyle = styled(Column)`
  margin: 10px;
`
const InputText = ({ label }) => {
  return (
    <InputTextStyle>
      <label htmlFor="input-text">{label}:</label>
      <input type="text" />
    </InputTextStyle>
  )
}

InputText.propTypes = {
  label: PropTypes.string.isRequired,
}

export default InputText
