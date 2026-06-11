import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Select } from '../../generic/form'
import InputNumberNoScrollWithUnit from '../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'

const ObservationSizeSelect = ({
  onValueEntered,
  onKeyDown,
  options = [],
  value = '',
  labelledBy = undefined,
  testid = undefined,
  disabled = false,
  plusInputTestId = 'size-50-input',
  ...restOfProps
}) => {
  const numericValue = Number(value)
  const isValue50OrMore = Number.isFinite(numericValue) && numericValue >= 50
  const optionSelected = isValue50OrMore ? 50 : value

  const [show50PlusInput, setShow50PlusInput] = useState(isValue50OrMore)
  const [plus50Value, setPlus50Value] = useState(isValue50OrMore ? value : 50)

  useEffect(() => {
    if (value === '' || value === null || typeof value === 'undefined') {
      setPlus50Value(50)
      setShow50PlusInput(false)
      return
    }

    if (isValue50OrMore) {
      setShow50PlusInput(true)
      setPlus50Value(value)
    }
  }, [isValue50OrMore, value])

  const handleSelectOnChange = (event) => {
    const selectedValue = event.target.value
    const isSelectedValue50 = selectedValue === '50'
    const valueToSubmit = isSelectedValue50 ? plus50Value : selectedValue

    setShow50PlusInput(isSelectedValue50)
    onValueEntered(valueToSubmit)
  }

  const handlePlus50OnChange = (event) => {
    setPlus50Value(event.target.value)
  }

  const handlePlus50OnBlur = (event) => {
    const eventValue = Number(event.target.value)
    const validPlus50Value = Number.isFinite(eventValue) && eventValue >= 50 ? eventValue : ''

    onValueEntered(validPlus50Value)
  }

  return (
    <>
      <Select
        onChange={handleSelectOnChange}
        onKeyDown={onKeyDown}
        value={optionSelected}
        aria-labelledby={labelledBy}
        data-testid={testid}
        disabled={disabled}
        {...restOfProps}
      >
        <option value=""> </option>
        {options.map(({ value: optionValue, label }) => {
          return (
            <option value={optionValue} key={optionValue}>
              {label}
            </option>
          )
        })}
      </Select>
      {show50PlusInput && (
        <InputNumberNoScrollWithUnit
          value={plus50Value}
          onChange={handlePlus50OnChange}
          onBlur={handlePlus50OnBlur}
          type="number"
          min="50"
          unit="cm"
          step="any"
          aria-labelledby={labelledBy}
          data-testid={plusInputTestId}
          disabled={disabled}
        />
      )}
    </>
  )
}

ObservationSizeSelect.propTypes = {
  onValueEntered: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelledBy: PropTypes.string,
  testid: PropTypes.string,
  disabled: PropTypes.bool,
  plusInputTestId: PropTypes.string,
}

export default ObservationSizeSelect
