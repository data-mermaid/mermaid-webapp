import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { InputRow, ValidationMessage } from '../form'
import theme from '../../../theme'
import { IconCheck } from '../../icons'

const CheckBoxLabel = styled.label`
  padding: ${theme.spacing.xsmall};
  width: 100%;
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

const InputCheckboxGroupWithLabelAndValidation = ({
  id,
  label,
  onChange,
  options,
  validationMessage,
  validationType,
  value,
}) => {
  const [checkboxItems, setCheckboxItems] = useState([])

  const _loadCheckboxItems = useEffect(() => {
    setCheckboxItems(value)
  }, [value])

  const handleCheckboxGroupChange = itemValue => {
    const updateCheckboxItems = [...checkboxItems]
    const foundItemIndex = updateCheckboxItems.indexOf(itemValue)

    if (foundItemIndex > -1) {
      updateCheckboxItems.splice(foundItemIndex, 1)
    } else {
      updateCheckboxItems.push(itemValue)
    }

    setCheckboxItems(updateCheckboxItems)
    onChange({ selectedItems: updateCheckboxItems })
  }

  const checkboxGroup = options.map(item => (
    <CheckBoxLabel htmlFor={item.value} key={item.value}>
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
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <div>{checkboxGroup}</div>
      <div>
        {validationMessage && (validationType === 'error' || validationType === 'warning') ? (
          <ValidationMessage validationType={validationType}>{validationMessage}</ValidationMessage>
        ) : null}
        {validationType === 'ok' ? <IconCheck aria-label="Passed validation" /> : null}
      </div>
    </InputRow>
  )
}

InputCheckboxGroupWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  validationType: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        profile: PropTypes.string,
        profile_name: PropTypes.string,
      }),
    ]),
  ).isRequired,
}

InputCheckboxGroupWithLabelAndValidation.defaultProps = {
  validationMessage: undefined,
  validationType: undefined,
}

export default InputCheckboxGroupWithLabelAndValidation
