import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'

const IgnoreWarningLabel = styled.label`
  white-space: nowrap;
  display: block;
  & input {
    vertical-align: middle;
    position: relative;
  }
`

const InputIgnoreValidationWarningCheckboxWithLabel = ({ onChange, checked }) => {
  return (
    <IgnoreWarningLabel>
      <input type="checkbox" onChange={onChange} checked={checked} /> Ignore warning
    </IgnoreWarningLabel>
  )
}

InputIgnoreValidationWarningCheckboxWithLabel.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
}

export default InputIgnoreValidationWarningCheckboxWithLabel
