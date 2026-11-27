import React, { useEffect, useId, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { Select } from '../../generic/form'
import LocaleNumberInput from '../../mermaidInputs/LocaleNumberInput/LocaleNumberInput'
import { hasNonEmptyValue } from '../../../library/hasNonEmptyValue'

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

  const plus50InputId = useId()
  const [show50PlusInput, setShow50PlusInput] = useState(isValue50OrMore)
  const [plus50Value, setPlus50Value] = useState(isValue50OrMore ? numericValue : 50)

  // The input rounds on blur and reports the rounded value just before calling onBlur, before
  // React has re-rendered with it. The blur check reads this ref so it sees that rounded value.
  const latestPlus50Value = useRef(plus50Value)
  const updatePlus50Value = (newValue) => {
    latestPlus50Value.current = newValue
    setPlus50Value(newValue)
  }

  useEffect(() => {
    if (!hasNonEmptyValue(value)) {
      latestPlus50Value.current = 50
      setPlus50Value(50)
      setShow50PlusInput(false)
      return
    }

    if (isValue50OrMore) {
      latestPlus50Value.current = numericValue
      setShow50PlusInput(true)
      setPlus50Value(numericValue)
    } else {
      setShow50PlusInput(false)
    }
  }, [isValue50OrMore, numericValue, value])

  const handleSelectOnChange = (event) => {
    const selectedValue = event.target.value
    const isSelectedValue50 = selectedValue === '50'
    const valueToSubmit = isSelectedValue50 ? plus50Value : selectedValue

    setShow50PlusInput(isSelectedValue50)
    onValueEntered(valueToSubmit)
  }

  const handlePlus50OnBlur = () => {
    const enteredValue = latestPlus50Value.current
    const isValidPlus50Value = typeof enteredValue === 'number' && enteredValue >= 50

    onValueEntered(isValidPlus50Value ? enteredValue : '')
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
        <LocaleNumberInput
          id={plus50InputId}
          value={plus50Value}
          onChange={updatePlus50Value}
          onBlur={handlePlus50OnBlur}
          decimalPlaces={1}
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
