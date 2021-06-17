import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import { Menu, Item } from './InputAutocomplete.styles'
import { InputRow, Input } from '../form'

const InputWrapper = styled(Input)`
  width: 100%;
`

const InputAutocomplete = ({
  label,
  id,
  options,
  placeholder,
  value,
  onChange,
}) => {
  const initialValue = options.find((option) => option.value === value) ?? ''
  const [selectedValue, setSelectedValue] = useState(initialValue.label)
  const [menuOpen, setMenuOpen] = useState(false)

  const getfilteredMenuOptions = (inputValue) => {
    const filteredItems = inputValue
      ? matchSorter(options, inputValue, {
          keys: ['label'],
        })
      : options

    filteredItems.map((item) => item.label)
  }

  const handleStateChange = (changes) => {
    const { selectedItem, inputValue } = changes
    const shouldMenuBeOpen =
      inputValue?.length >= 3 && inputValue !== selectedValue

    if (selectedItem) {
      setSelectedValue(selectedItem)
      onChange(selectedItem)
      setMenuOpen(false)
    }
    if (!selectedItem && inputValue) {
      setMenuOpen(shouldMenuBeOpen)
    }
  }

  return (
    <Downshift selectedItem={selectedValue} onStateChange={handleStateChange}>
      {({
        getRootProps,
        getInputProps,
        getMenuProps,
        getItemProps,
        selectedItem,
        inputValue,
        highlightedIndex,
      }) => (
        <InputRow>
          <label htmlFor={id}>{label}</label>
          <div
            {...getRootProps(undefined, {
              suppressRefError: true,
            })}
          >
            <InputWrapper
              {...getInputProps({
                placeholder,
              })}
            />
            <Menu {...getMenuProps({ isOpen: menuOpen })}>
              {menuOpen
                ? getfilteredMenuOptions(inputValue).map((item, index) => {
                    return (
                      <Item
                        key={item}
                        {...getItemProps({
                          item,
                          index,
                          isActive: highlightedIndex === index,
                          isSelected: selectedItem === item,
                        })}
                      >
                        {item}
                      </Item>
                    )
                  })
                : null}
            </Menu>
          </div>
        </InputRow>
      )}
    </Downshift>
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
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

InputAutocomplete.defaultProps = {
  value: '',
  placeholder: 'Search...',
}

export default InputAutocomplete
