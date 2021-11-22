import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { InputRow, CheckRadioLabel, CheckRadioWrapper } from '../../generic/form'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputCheckboxGroupWithLabelAndValidation = ({
  id,
  ignoreNonObservationFieldValidations,
  label,
  onChange,
  options,
  resetNonObservationFieldValidations,
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
    <CheckRadioWrapper key={item.value}>
      <input
        id={item.value}
        type="checkbox"
        value={item.value}
        checked={checkboxItems.includes(item.value)}
        onChange={(event) => handleCheckboxGroupChange({ itemValue: item.value, event })}
      />
      <CheckRadioLabel htmlFor={item.value}>{item.label}</CheckRadioLabel>
    </CheckRadioWrapper>
  ))

  return (
    <InputRow validationType={validationType}>
      <label htmlFor={id}>{label}</label>
      <div>{checkboxGroup}</div>
      <InputValidationInfo
        ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
        resetNonObservationFieldValidations={resetNonObservationFieldValidations}
        validationMessages={validationMessages}
        validationType={validationType}
      />
    </InputRow>
  )
}

InputCheckboxGroupWithLabelAndValidation.propTypes = {
  id: PropTypes.string.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
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
