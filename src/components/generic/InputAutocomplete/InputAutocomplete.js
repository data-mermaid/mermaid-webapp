import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import { Menu, Item } from './InputAutocomplete.styles'
import { Input, HelperText } from '../form'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import theme from '../../../theme'

const AutoCompleteInput = styled(Input)`
  width: 100%;
`
const AutoCompleteResultsWrapper = styled.div`
  position: relative;
`
const NoResultSection = styled.div`
  position: absolute;
  top: 4rem;
  outline: ${theme.color.outline};
  outline-offset: -3px;
  background: ${theme.color.white};
  z-index: 99;
  width: 100%;
  p {
    margin: ${theme.spacing.small};
  }
  button {
    width: 100%;
    border: none;
    text-align: start;
    padding: ${theme.spacing.small};
  }
`

const InputAutocomplete = ({
  className,
  helperText,
  id,
  noResultsAction,
  noResultsText,
  onChange,
  onKeyDown,
  options,
  isTabUsedToSelectHighlighted,
  value,
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
          selectedItem: isTabUsedToSelectHighlighted ? menuItems[state.highlightedIndex] : null,
        }
      }
      default:
        return changes
    }
  }

  const handleStateChange = useCallback(
    (changes) => {
      const { selectedItem, inputValue } = changes

      const shouldMenuBeOpen = inputValue?.length >= 3 && inputValue !== selectedValue.label

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
    [selectedValue.label, onChange],
  )

  const handleInputValueChange = useCallback(
    (inputValueItem) => {
      const matchingMenuItems = inputValueItem
        ? matchSorter(options, inputValueItem, {
            keys: ['label'],
          })
        : options

      setMenuItems(matchingMenuItems)
    },
    [options],
  )

  const getMenuContents = useCallback(
    (downshiftObject) => {
      const { getItemProps, highlightedIndex } = downshiftObject

      return menuItems.length
        ? menuItems.map((item, index) => {
            return (
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
            )
          })
        : null
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
            <div>
              <AutoCompleteInput
                {...getInputProps({ onKeyDown })}
                aria-describedby={`aria-descp${id}`}
                id={id}
                {...restOfProps}
              />
              {helperText && <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>}
            </div>
            <Menu {...getMenuProps({ isOpen: isMenuOpen })}>
              {isMenuOpen && getMenuContents(downshiftObject)}
            </Menu>
            {isMenuOpen && !menuItems.length && (
              <NoResultSection>
                <p data-testid="noResult">{noResultsText}</p>
                {noResultsAction}
              </NoResultSection>
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
  id: PropTypes.string.isRequired,
  noResultsAction: PropTypes.node,
  noResultsText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  options: inputOptionsPropTypes.isRequired,
  isTabUsedToSelectHighlighted: PropTypes.bool,
  value: PropTypes.string,
}

InputAutocomplete.defaultProps = {
  className: undefined,
  helperText: undefined,
  noResultsAction: undefined,
  noResultsText: undefined,
  onKeyDown: undefined,
  isTabUsedToSelectHighlighted: false,
  value: '',
}

export default InputAutocomplete
