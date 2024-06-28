import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Select } from '../../../generic/form'
import { fishBeltBins } from './fishBeltBins'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'

export const FishBeltObservationSizeSelect = ({
  onValueEntered,
  fishBinSelectedLabel = undefined,
  value = '',
  labelledBy = undefined,
  ...restOfProps
}) => {
  const binsToUse = fishBeltBins[fishBinSelectedLabel] ?? []
  const isValue50OrMore = value >= 50
  const optionSelected = isValue50OrMore ? 50 : value
  const [show50PlusInput, setShow50PlusInput] = useState(isValue50OrMore)
  const [plus50Value, setPlus50Value] = useState(value >= 50 ? value : 50)

  const _resetPlus50 = useEffect(() => {
    if (!value) {
      setPlus50Value(50)
      setShow50PlusInput(false)
    }
  }, [value])

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
    const eventValue = event.target.value
    const validPlus50Value = eventValue < 50 ? '' : eventValue

    onValueEntered(validPlus50Value)
  }

  return (
    <>
      <Select
        onChange={handleSelectOnChange}
        value={optionSelected}
        aria-labelledby={labelledBy}
        {...restOfProps}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <option value=""> </option>
        {binsToUse.map(({ value: optionValue, label }) => {
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
        />
      )}
    </>
  )
}

FishBeltObservationSizeSelect.propTypes = {
  onValueEntered: PropTypes.func.isRequired,
  fishBinSelectedLabel: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelledBy: PropTypes.string,
}
