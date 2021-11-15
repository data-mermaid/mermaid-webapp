import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { InputRow } from '../../generic/form'
import theme from '../../../theme'

import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

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
  ignoreValidations,
  label,
  onChange,
  options,
  resetValidations,
  validationMessages,
  validationType,
  value,
}) => {
  const [checkboxItems, setCheckboxItems] = useState([])

  const _loadCheckboxItems = useEffect(() => {
    setCheckboxItems(value)
  }, [value])

  const handleCheckboxGroupChange = ({ itemValue, event }) => {
    const updateCheckboxItems = [...checkboxItems]
    const foundItemIndex = updateCheckboxItems.indexOf(itemValue)

    if (foundItemIndex > -1) {
      updateCheckboxItems.splice(foundItemIndex, 1)
    } else {
      updateCheckboxItems.push(itemValue)
    }

    setCheckboxItems(updateCheckboxItems)
    onChange({ selectedItems: updateCheckboxItems, event })
  }

  const checkboxGroup = options.map((item) => (
    <CheckBoxLabel htmlFor={item.value} key={item.value}>
      <input
        id={item.value}
        type="checkbox"
        value={item.value}
        checked={checkboxItems.includes(item.value)}
        onChange={(event) => handleCheckboxGroupChange({ itemValue: item.value, event })}
      />
      {item.label}
    </CheckBoxLabel>
  ))

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <div>{checkboxGroup}</div>
      <InputValidationInfo
        ignoreValidations={ignoreValidations}
        resetValidations={resetValidations}
        validationMessages={validationMessages}
        validationType={validationType}
      />
    </InputRow>
  )
}

InputCheckboxGroupWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  resetValidations: PropTypes.func.isRequired,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
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
  validationMessages: [],
  validationType: undefined,
}

export default InputCheckboxGroupWithLabelAndValidation
