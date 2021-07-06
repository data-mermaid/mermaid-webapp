import React, { useEffect, useMemo, useState } from 'react'
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

const NoResultSection = styled.div`
  padding-top: 10px;
`

const InputAutocomplete = ({
  options,
  value,
  onChange,
  noResultsDisplay,
  ...restOfProps
}) => {
  const optionMatchingValueProp = useMemo(
    () => options.find((option) => option.value === value) ?? '',
    [options, value],
  )

  const [selectedValue, setSelectedValue] = useState(optionMatchingValueProp)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const _updateSelectedValueWhenPropsChange = useEffect(() => {
    setIsMenuOpen(false)
    setSelectedValue(optionMatchingValueProp)
  }, [optionMatchingValueProp])

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
      inputValue?.length >= 3 && inputValue !== selectedValue.label

    if (selectedItem) {
      setSelectedValue(selectedItem)
      onChange(selectedItem)
      setIsMenuOpen(false)
    }
    if (!selectedItem && inputValue) {
      setIsMenuOpen(shouldMenuBeOpen)
    }
  }

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
              key={item.value}
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
      : null
  }

  return (
    <Downshift
      selectedItem={selectedValue}
      onStateChange={handleStateChange}
      itemToString={(item) => (item ? item.label : '')}
    >
      {(downshiftObject) => {
        const {
          getRootProps,
          getInputProps,
          getMenuProps,
          inputValue,
        } = downshiftObject

        return (
          <div
            style={{ position: 'relative' }}
            {...getRootProps(undefined, {
              suppressRefError: true,
            })}
          >
            <AutoCompleteInput {...getInputProps()} {...restOfProps} />
            <Menu {...getMenuProps({ isOpen: isMenuOpen })}>
              {isMenuOpen && getMenuContents(downshiftObject)}
            </Menu>
            {getMatchingMenuItems(inputValue).length === 0 && (
              <NoResultSection>
                {noResultsDisplay || language.autocomplete.noResultsDefault}
              </NoResultSection>
            )}
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
  value: PropTypes.string,
}

InputAutocomplete.defaultProps = {
  noResultsDisplay: undefined,
  value: '',
}

export default InputAutocomplete
