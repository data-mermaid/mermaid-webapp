import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import theme from '../../../theme'
import { InputRow } from '../form'

const CheckBoxLabel = styled.label`
  padding: ${theme.spacing.xsmall};
  width: 100%;
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

const InputCheckboxWithLabel = ({ label, id, options, value, onChange }) => {
  const [checkboxItems, setCheckboxItems] = useState(value)

  const handleCheckboxGroupChange = (itemValue) => {
    const updateCheckboxItems = [...checkboxItems]
    const foundItemIndex = updateCheckboxItems.indexOf(itemValue)

    if (foundItemIndex > -1) {
      updateCheckboxItems.splice(foundItemIndex, 1)
    } else {
      updateCheckboxItems.push(itemValue)
    }

    setCheckboxItems(updateCheckboxItems)
    onChange(updateCheckboxItems)
  }

  const checkboxGroup = options.map((item) => (
    <CheckBoxLabel htmlFor="checkbox-groups" key={item.value}>
      <input
        id={item.value}
        type="checkbox"
        value={item.value}
        checked={checkboxItems.includes(item.value)}
        onChange={() => handleCheckboxGroupChange(item.value)}
      />
      {item.label}
    </CheckBoxLabel>
  ))

  return (
    <InputRow>
      <label htmlFor={id}>{label}</label>
      <div>{checkboxGroup}</div>
    </InputRow>
  )
}

InputCheckboxWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default InputCheckboxWithLabel
