import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import { Menu, Item } from './InputAutocomplete.styles'
import { Input } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'

const AutoCompleteInput = styled(Input)`
  width: 100%;
`

const InputAutocomplete = ({
  options,
  placeholder,
  value,
  onChange,
  ...restOfProps
}) => {
  const initialValue = options.find((option) => option.value === value) ?? ''
  const [selectedValue, setSelectedValue] = useState(initialValue)
  const [menuOpen, setMenuOpen] = useState(false)

  const getfilteredMenuOptions = (inputValue) => {
    const filteredItems = inputValue
      ? matchSorter(options, inputValue, {
          keys: ['label'],
        })
      : options

    return filteredItems
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
    <Downshift
      selectedItem={selectedValue}
      onStateChange={handleStateChange}
      itemToString={(item) => (item ? item.label : '')}
    >
      {({
        getRootProps,
        getInputProps,
        getMenuProps,
        getItemProps,
        selectedItem,
        inputValue,
        highlightedIndex,
      }) => (
        <div
          style={{ position: 'relative' }}
          {...getRootProps(undefined, {
            suppressRefError: true,
          })}
        >
          <AutoCompleteInput
            {...getInputProps({
              placeholder,
            })}
            {...restOfProps}
          />
          <Menu {...getMenuProps({ isOpen: menuOpen })}>
            {menuOpen
              ? getfilteredMenuOptions(inputValue).map((item, index) => {
                  return (
                    <Item
                      key={item.label}
                      {...getItemProps({
                        item,
                        index,
                        isActive: highlightedIndex === index,
                        isSelected: selectedItem === item,
                      })}
                    >
                      {item.label}
                    </Item>
                  )
                })
              : null}
          </Menu>
        </div>
      )}
    </Downshift>
  )
}

InputAutocomplete.propTypes = {
  options: inputOptionsPropTypes.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

InputAutocomplete.defaultProps = {
  value: '',
  placeholder: undefined,
}

export default InputAutocomplete
