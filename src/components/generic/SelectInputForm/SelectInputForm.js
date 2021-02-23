import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../positioning'
/**
 * Describe your component
 */

const SelectInputStyle = styled(Column)`
  margin: 10px;
`

const SelectInputForm = ({ label, options }) => {
  const optionList = options.map(({ name }) => (
    <option key={name} value={name}>
      {name}
    </option>
  ))

  return (
    <SelectInputStyle>
      <label htmlFor="mermaid-select">{label}:</label>
      <select id="mermaid-select">
        {/* <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option> */}
        {optionList}
      </select>
    </SelectInputStyle>
  )
}

SelectInputForm.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
}

export default SelectInputForm
