import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Select } from '../../../generic/form'
import { fishBeltBins } from './fishBeltBins'
import InputNumberNoScrollWithUnit from '../../../generic/InputNumberNoScrollWithUnit/InputNumberNoScrollWithUnit'
import { getClosestNumberInArray } from '../../../../library/arrays/getClosestNumberInArray'

export const FishBeltObservationSizeSelect = ({
  onChange,
  fishBinSelectedLabel,
  value,
  labelledBy,
}) => {
  const binsToUse = fishBeltBins[fishBinSelectedLabel] ?? []
  const isValue50OrMore = value >= 50
  const optionValues = binsToUse.map((bin) => bin.value)

  const optionValueToSelect = isValue50OrMore
    ? 50
    : getClosestNumberInArray(value, optionValues)

  const [show50PlusInput, setShow50PlusInput] = useState(isValue50OrMore)
  const [plus50Value, setPlus50Value] = useState(value >= 50 ? value : 50)

  const handleSelectOnChange = (event) => {
    const selectedValue = event.target.value
    const isSelectedValue50 = selectedValue === '50'
    const valueToSubmit = isSelectedValue50 ? plus50Value : selectedValue

    setShow50PlusInput(isSelectedValue50)
    onChange(valueToSubmit)
  }

  const handlePlus50OnChange = (event) => {
    const targetValue = event.target.value

    setPlus50Value(targetValue)
    onChange(targetValue)
  }

  return (
    <>
      <Select
        onChange={handleSelectOnChange}
        value={optionValueToSelect}
        aria-labelledby={labelledBy}
      >
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
  onChange: PropTypes.func.isRequired,
  fishBinSelectedLabel: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  labelledBy: PropTypes.string,
}

FishBeltObservationSizeSelect.defaultProps = {
  fishBinSelectedLabel: undefined,
  labelledBy: undefined,
}
