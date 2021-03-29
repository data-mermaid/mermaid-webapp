import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import theme from '../../../theme'
import stopEventPropagation from '../../../library/stopEventPropagation'

const CheckBoxStyle = styled.label`
  padding: ${theme.spacing.xsmall};
  width: 100%;
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

const CheckBoxWithLabel = ({ id, label, ...restOfProps }) => {
  return (
    <CheckBoxStyle htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        onClick={stopEventPropagation}
        {...restOfProps}
      />
      {label}
    </CheckBoxStyle>
  )
}

CheckBoxWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default CheckBoxWithLabel
