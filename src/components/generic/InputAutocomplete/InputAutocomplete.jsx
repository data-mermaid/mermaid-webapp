import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import { Menu, Item } from './InputAutocomplete.styles'
import { Input, HelperText } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import theme from '../../../theme'

const AutoCompleteInput = styled(Input)`
  width: 100%;
  min-width: 17.5rem;
`
const AutoCompleteResultsWrapper = styled.div`
  position: relative;

  & > div {
    z-index: 110;
    position: absolute;
    display: block;
    width: 100%;
    top: 4rem;
    outline: ${theme.color.outline};
    outline-offset: -2px;
    background: ${theme.color.white};

    > * {
      margin: 0;
      padding: ${theme.spacing.buttonPadding};
    }
  }

  button {
    width: 100%;
    border: none;
    text-align: start;
    padding: ${theme.spacing.small};
  }
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
  ...restOfProps
}) => {
  const optionMatchingValueProp = useMemo(
    () => options.find((option) => option.value === value) ?? '',
    [options, value],
  )

  const [selectedValue, setSelectedValue] = useState(optionMatchingValueProp)
  const [menuItems, setMenuItems] = useState(options)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      // scroll to bottom of page to show full menu contents
      if (isLastRow && isMenuOpen) {
        window.scrollTo(0, document.body.scrollHeight)
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
          highlighted={highlightedIndex === index}
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
            <Menu {...getMenuProps({ isOpen: isMenuOpen })}>
              {isMenuOpen && getMenuContents(downshiftObject)}
            </Menu>
            {isMenuOpen && !menuItems.length && (
              <div>
                {noResultsText && <p data-testid="noResult">{noResultsText}</p>}
                {noResultsAction}
              </div>
            )}
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
}

export default InputAutocomplete
