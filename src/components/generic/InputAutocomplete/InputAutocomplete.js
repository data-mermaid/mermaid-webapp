import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'
import { matchSorter } from 'match-sorter'
import { InputRow } from '../form'

const InputAutocomplete = ({ label, id, options, value, onChange }) => {
  const [customOptions, setCustomOptions] = useState(options)
  const [menuOpen, setMenuOpen] = useState(false)

  const initialValue = options.find((option) => option.value === value) || ''

  const handleDisplayValueChange = (selectedItem) => onChange(selectedItem)

  const handleInputChange = (inputValue) => {
    if (inputValue.length > 2) setMenuOpen(true)
    else setMenuOpen(false)

    setCustomOptions(
      matchSorter(options, inputValue, {
        keys: ['label'],
      }),
    )
  }

  return (
    <InputRow>
      <label htmlFor={id}>{label}</label>
      <Select
        menuIsOpen={menuOpen}
        value={initialValue}
        noOptionsMessage={() => 'No Results'}
        options={customOptions}
        onChange={handleDisplayValueChange}
        onInputChange={handleInputChange}
        filterOption={() => true}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
    </InputRow>
  )
}

InputAutocomplete.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default InputAutocomplete
