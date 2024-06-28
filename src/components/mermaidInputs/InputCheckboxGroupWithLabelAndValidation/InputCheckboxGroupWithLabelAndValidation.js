import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { InputRow, CheckRadioLabel, CheckRadioWrapper, RequiredIndicator } from '../../generic/form'
import InputValidationInfo from '../InputValidationInfo/InputValidationInfo'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const InputCheckboxGroupWithLabelAndValidation = ({
  id,
  required,
  ignoreNonObservationFieldValidations = () => {},
  label,
  onChange,
  options,
  resetNonObservationFieldValidations = () => {},
  validationMessages = [],
  validationType = undefined,
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
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label id={`${id}-checkbox-group-with-label-and-validation`}>
        {label}
        {required ? <RequiredIndicator /> : null}
      </label>
      <div aria-labelledby={`${id}-checkbox-group-with-label-and-validation`}>{checkboxGroup}</div>
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
  required: PropTypes.bool.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  resetNonObservationFieldValidations: PropTypes.func,
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

export default InputCheckboxGroupWithLabelAndValidation
