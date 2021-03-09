import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../positioning'
/**
 * Describe your component
 */

const InputSelectStyle = styled(Row)`
  margin: 10px;
  align-items: center;
`

const InputSelect = ({ label, options, ...restOfProps }) => {
  const optionList = options.map(({ name }) => (
    <option key={name} value={name}>
      {name}
    </option>
  ))

  return (
    <InputSelectStyle>
      <label htmlFor="input-select">{label}</label>
      <select {...restOfProps}>{optionList}</select>
    </InputSelectStyle>
  )
}

InputSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default InputSelect
