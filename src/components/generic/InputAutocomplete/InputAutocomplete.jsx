import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import { Menu, Item } from './InputAutocomplete.styles'
import { Input, HelperText } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'

const AutoCompleteInput = styled(Input)`
  width: 100%;
  min-width: 17.5rem;
`
const AutoCompleteResultsWrapper = styled.div`
  position: relative;
`

const InputAutocomplete = ({
  className = undefined,
  helperText = undefined,
  id,
  isLastRow = false,
  noResultsAction = undefined,
  noResultsText = undefined,
  onChange,
  onKeyDown = undefined,
  options,
  value = '',
  onInputValueChange = undefined,
  menuTestId = undefined,
  ...restOfProps
}) => {
  const optionMatchingValueProp = useMemo(
    () => options.find((option) => option.value === value) ?? '',
    [options, value],
  )

  const [selectedValue, setSelectedValue] = useState(optionMatchingValueProp)
  const [menuItems, setMenuItems] = useState(options)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const _updateSelectedValueWhenPropsChange = useEffect(() => {
    setIsMenuOpen(false)
    setSelectedValue(optionMatchingValueProp)
  }, [optionMatchingValueProp])

  const stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.blurInput: {
        // This causes the tab key to behave like the enter
        // key and select the item associated with the key press
        // blurInput = tab or shift+tab for Downshift

        return {
          ...changes,
          selectedItem: menuItems[state.highlightedIndex],
        }
      }
      default:
        return changes
    }
  }

  const handleStateChange = useCallback(
    (changes) => {
      const { selectedItem, inputValue } = changes

      onInputValueChange?.(inputValue)

      const shouldMenuBeOpen = inputValue?.length >= 1 && inputValue !== selectedValue.label

      if (selectedItem) {
        onChange(selectedItem)
        setIsMenuOpen(false)
      }

      if (!selectedItem && inputValue) {
        setIsMenuOpen(shouldMenuBeOpen)
      }

      if (inputValue === '') {
        setIsMenuOpen(false)
      }
    },
    [onInputValueChange, selectedValue.label, onChange],
  )

  const handleInputValueChange = useCallback(
    (inputValueItem) => {
      // Nudge the open dropdown into view when it's the last row, without
      // jumping the whole page to the bottom (which overshoots when other
      // content is rendered below the table, e.g. the density summary).
      // Deferred a frame so the scroll uses the freshly filtered menu height.
      if (isLastRow && isMenuOpen) {
        requestAnimationFrame(() => {
          menuRef.current?.scrollIntoView?.({ block: 'nearest' })
        })
      }

      const matchingMenuItems = inputValueItem
        ? matchSorter(options, inputValueItem, {
            keys: ['label'],
          })
        : options

      setMenuItems(matchingMenuItems)
    },
    [options, isLastRow, isMenuOpen],
  )

  const getMenuContents = useCallback(
    (downshiftObject) => {
      const { getItemProps, highlightedIndex } = downshiftObject

      return menuItems.map((item, index) => (
        <Item
          {...getItemProps({
            item,
            index,
          })}
          key={item.value}
          $highlighted={highlightedIndex === index}
        >
          {item.label}
        </Item>
      ))
    },
    [menuItems],
  )

  return (
    <Downshift
      selectedItem={selectedValue}
      onStateChange={handleStateChange}
      onInputValueChange={handleInputValueChange}
      itemToString={(item) => (item ? item.label : '')}
      stateReducer={stateReducer}
    >
      {(downshiftObject) => {
        const { getRootProps, getInputProps, getMenuProps } = downshiftObject

        return (
          <AutoCompleteResultsWrapper
            {...getRootProps(undefined, {
              suppressRefError: true,
            })}
            className={className}
          >
            <AutoCompleteInput
              {...getInputProps({ onKeyDown })}
              aria-describedby={`aria-descp${id}`}
              id={id}
              {...restOfProps}
            />
            {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
            <Menu
              {...getMenuProps({
                $isOpen: isMenuOpen,
                'data-testid': menuTestId,
                ref: menuRef,
              })}
            >
              {isMenuOpen && menuItems.length > 0 && getMenuContents(downshiftObject)}
              {isMenuOpen && !menuItems.length && noResultsText && (
                <Item role="presentation" data-testid="noResult">
                  {noResultsText}
                </Item>
              )}
              {isMenuOpen && !menuItems.length && noResultsAction && (
                <Item role="presentation">{noResultsAction}</Item>
              )}
            </Menu>
          </AutoCompleteResultsWrapper>
        )
      }}
    </Downshift>
  )
}

InputAutocomplete.propTypes = {
  className: PropTypes.string,
  helperText: PropTypes.string,
  isLastRow: PropTypes.bool,
  id: PropTypes.string.isRequired,
  noResultsAction: PropTypes.node,
  noResultsText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  options: inputOptionsPropTypes.isRequired,
  value: PropTypes.string,
  onInputValueChange: PropTypes.func,
  menuTestId: PropTypes.string,
}

export default InputAutocomplete
