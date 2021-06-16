import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import { InputRow, Input } from '../form'
import { IconClose } from '../../icons'

const BaseMenu = styled('ul')(
  {
    padding: 0,
    marginTop: 0,
    position: 'absolute',
    backgroundColor: 'white',
    width: '300px',
    maxHeight: '16.5rem',
    overflowY: 'auto',
    overflowX: 'hidden',
    outline: '0',
    transition: 'opacity .1s ease',
    borderRadius: '0 0 .28571429rem .28571429rem',
    boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    borderColor: '#96c8da',
    borderTopWidth: '0',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  ({ isOpen }) => ({
    border: isOpen ? null : 'none',
  }),
)

const Item = styled('li')(
  {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1.2rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({ isActive, isSelected }) => {
    const styles = []

    if (isActive) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        background: 'rgba(0,0,0,.03)',
      })
    }
    if (isSelected) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        fontWeight: '700',
      })
    }

    return styles
  },
)

const ControllerButton = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  right: 0,
  top: 0,
  cursor: 'pointer',
  width: 47,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})

const InputWrapper = styled(Input)`
  width: 100%;
`

const InputDownshift = ({
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

  function getItems(filter) {
    return filter
      ? matchSorter(options, filter, {
          keys: ['label'],
        })
      : options
  }

  function getStringItems(filter) {
    const result = getItems(filter).map(({ label: itemLabel }) => itemLabel)

    return result
  }

  const handleStateChange = (changes) => {
    if (changes.hasOwnProperty('selectedItem')) {
      setSelectedValue(changes.selectedItem)
      onChange(changes.selectedItem)
      setMenuOpen(false)
    } else if (changes.hasOwnProperty('inputValue')) {
      if (changes.inputValue.length < 3) {
        setMenuOpen(false)
      } else if (changes.inputValue === selectedValue) {
        setMenuOpen(false)
      } else setMenuOpen(true)
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
            <BaseMenu {...getMenuProps({ isOpen: menuOpen })}>
              {menuOpen
                ? getStringItems(inputValue).map((item, index) => {
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
            </BaseMenu>
          </div>
          {selectedItem && (
            <ControllerButton
              onClick={() => {
                setSelectedValue('')
                onChange('')
              }}
              aria-label="clear selection"
            >
              <IconClose />
            </ControllerButton>
          )}
        </InputRow>
      )}
    </Downshift>
  )
}

InputDownshift.propTypes = {
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

InputDownshift.defaultProps = {
  value: '',
  placeholder: 'Search...',
}

export default InputDownshift
