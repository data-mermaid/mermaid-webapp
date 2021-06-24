import React, { useState, useEffect } from 'react'
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
  valueIsArray,
  value,
  onChange,
}) => {
  const foundOptionValue =
    options.find((option) => option.value === value) ?? ''
  const initialValue = valueIsArray ? value : foundOptionValue.label

  const [selectedValue, setSelectedValue] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const _loadInitialSelectedValue = useEffect(() => {
    if (initialValue) setSelectedValue(initialValue)
  }, [initialValue])

  const getFilteredMenuOptions = (inputValue) => {
    const filteredItems = inputValue
      ? matchSorter(options, inputValue, {
          keys: ['label'],
        })
      : options

    return filteredItems.map(({ label: itemLabel }) => itemLabel)
  }

  const handleStateChange = (changes) => {
    const { selectedItem, inputValue } = changes
    const shouldMenuBeOpen =
      inputValue?.length >= 3 && inputValue !== selectedValue

    if (selectedItem) {
      const updateSelectedValue = valueIsArray
        ? [...selectedValue]
        : selectedItem

      if (valueIsArray) {
        const foundItemIndex = updateSelectedValue.indexOf(selectedItem)

        if (foundItemIndex === -1) {
          updateSelectedValue.push(selectedItem)
        }
      }

      setSelectedValue(updateSelectedValue)
      onChange(updateSelectedValue)
      setMenuOpen(false)
    }
    if (!selectedItem && inputValue) {
      setMenuOpen(shouldMenuBeOpen)
    }
  }

  return (
    <Downshift
      selectedItem={valueIsArray ? '' : selectedValue}
      onStateChange={handleStateChange}
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
                ? getFilteredMenuOptions(inputValue).map((item, index) => {
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
  valueIsArray: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onChange: PropTypes.func.isRequired,
}

InputAutocomplete.defaultProps = {
  value: '',
  placeholder: 'Search...',
  valueIsArray: false,
}

export default InputAutocomplete
