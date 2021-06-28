import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import { Menu, Item } from './InputAutocomplete.styles'
import { Input } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import language from '../../../language'

const AutoCompleteInput = styled(Input)`
  width: 100%;
`

const NoResultsContainer = styled.div`
  background: magenta;
`

const InputAutocomplete = ({
  options,
  placeholder,
  value,
  onChange,
  noResultsDisplay,
  ...restOfProps
}) => {
  const initialValue = options.find((option) => option.value === value) ?? ''
  const [selectedValue, setSelectedValue] = useState(initialValue)
  const [menuOpen, setMenuOpen] = useState(false)

  const getMatchingMenuItems = (inputValue) => {
    const matchingOptions = inputValue
      ? matchSorter(options, inputValue, {
          keys: ['label'],
        })
      : options

    return matchingOptions
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

  const noResults = (
    <NoResultsContainer>
      {noResultsDisplay || language.autocomplete.noResultsDefault}
    </NoResultsContainer>
  )

  const getMenuContents = (downshiftObject) => {
    const {
      inputValue,
      getItemProps,
      highlightedIndex,
      selectedItem,
    } = downshiftObject

    const matchingMenuItems = getMatchingMenuItems(inputValue)

    return matchingMenuItems.length
      ? matchingMenuItems.map((item, index) => {
          return (
            <Item
              key={item.label}
              {...getItemProps({
                item,
                index,
                isActive: highlightedIndex === index,
                isSelected: selectedItem.label === item.label,
              })}
            >
              {item.label}
            </Item>
          )
        })
      : noResults
  }

  return (
    <Downshift
      selectedItem={selectedValue}
      onStateChange={handleStateChange}
      itemToString={(item) => (item ? item.label : '')}
    >
      {(downshiftObject) => {
        const { getRootProps, getInputProps, getMenuProps } = downshiftObject

        return (
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
              {menuOpen && getMenuContents(downshiftObject)}
            </Menu>
          </div>
        )
      }}
    </Downshift>
  )
}

InputAutocomplete.propTypes = {
  noResultsDisplay: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  options: inputOptionsPropTypes.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
}

InputAutocomplete.defaultProps = {
  noResultsDisplay: undefined,
  placeholder: undefined,
  value: '',
}

export default InputAutocomplete
