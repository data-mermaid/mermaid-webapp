import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../positioning'

/**
 * Describe your component
 */

const InputTextStyle = styled(Row)`
  margin: 10px;
  align-items: center;
`

const InputText = ({ label }) => {
  return (
    <InputTextStyle>
      <label htmlFor="input-text">{label}</label>
      <input type="text" />
    </InputTextStyle>
  )
}

InputText.propTypes = {
  label: PropTypes.string.isRequired,
}

export default InputText
