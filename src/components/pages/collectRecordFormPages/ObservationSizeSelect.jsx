import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Select } from '../../generic/form'
import InputNumberNoScrollWithUnit from '../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import { hasNonEmptyValue } from '../../../library/hasNonEmptyValue'
import { sanitizeToOneDecimalPlace } from '../../../library/numbers/sanitizeToOneDecimalPlace'

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
  // Kept as the sanitized string (not a Number) so the field can display an
  // in-progress value like "52." while typing, without React's controlled
  // value collapsing it back to "52" on every keystroke.
  const [plus50Value, setPlus50Value] = useState(
    isValue50OrMore ? sanitizeToOneDecimalPlace(value) : '50',
  )

  useEffect(() => {
    if (!hasNonEmptyValue(value)) {
      setPlus50Value('50')
      setShow50PlusInput(false)
      return
    }

    if (isValue50OrMore) {
      setShow50PlusInput(true)
      setPlus50Value(sanitizeToOneDecimalPlace(value))
    } else {
      setShow50PlusInput(false)
    }
  }, [isValue50OrMore, value])

  const handleSelectOnChange = (event) => {
    const selectedValue = event.target.value
    const isSelectedValue50 = selectedValue === '50'
    const valueToSubmit = isSelectedValue50 ? Number(plus50Value) : selectedValue

    setShow50PlusInput(isSelectedValue50)
    onValueEntered(valueToSubmit)
  }

  const handlePlus50OnChange = (event) => {
    setPlus50Value(sanitizeToOneDecimalPlace(event.target.value))
  }

  const handlePlus50OnBlur = (event) => {
    const sanitizedValue = sanitizeToOneDecimalPlace(event.target.value)
    const numericValue = Number(sanitizedValue)
    const isValidPlus50Value = numericValue >= 50

    if (isValidPlus50Value) {
      // Recommit through the parsed number so a trailing/lone "." (e.g. "52.")
      // doesn't stay stuck in the display once the field is no longer being edited.
      setPlus50Value(String(numericValue))
    }
    onValueEntered(isValidPlus50Value ? numericValue : '')
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
          type="text"
          inputMode="decimal"
          $textAlign="right"
          unit="cm"
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
