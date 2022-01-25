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
  noResultsText,
  noResultsAction,
  id,
  helperText,
  onChange,
  options,
  value,
  onKeyDown,
  ...restOfProps
}) => {
  const [areMatchingMenuItems, setAreMatchingMenuItems] = useState(true)
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

  const getMenuContents = useCallback(
    (downshiftObject) => {
      const { inputValue, getItemProps, highlightedIndex, selectedItem } = downshiftObject

      const getMatchingMenuItems = (valueForMatching) => {
        const matchingOptions = valueForMatching
          ? matchSorter(options, valueForMatching, {
              keys: ['label'],
            })
          : options

        return matchingOptions
      }

      const matchingMenuItems = getMatchingMenuItems(inputValue)

      setAreMatchingMenuItems(matchingMenuItems.length)

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
    },
    [options],
  )

  return (
    <Downshift
      selectedItem={selectedValue}
      onStateChange={handleStateChange}
      itemToString={(item) => (item ? item.label : '')}
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
            {!areMatchingMenuItems && (
              <NoResultSection>
                <p data-testId="noResult">{noResultsText}</p>
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
  value: PropTypes.string,
}

InputAutocomplete.defaultProps = {
  className: undefined,
  helperText: undefined,
  noResultsAction: undefined,
  noResultsText: undefined,
  onKeyDown: undefined,
  value: '',
}

export default InputAutocomplete
