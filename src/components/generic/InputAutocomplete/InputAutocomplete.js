import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import { matchSorter } from 'match-sorter'
import theme from '../../../theme'
import { InputRow } from '../form'

const MenuList = styled.ul`
  margin-top: 10px;
  padding: 0;
  border-top: 0;
  background: 'white';
  list-style: none;
  position: absolute;
  height: 196px;
  overflow-y: scroll;
`

const MenuListItem = styled.li`
  padding: 4px 10px;
`

const TypeAHeadInput = styled.input`
  width: 100%;
`

const stateReducer = (state, changes) => {
  if (changes.inputValue && changes.inputValue.length < 3)
    return { ...changes, isOpen: false }

  return changes
}

const InputAutocomplete = ({ label, id, options }) => {
  const getItems = (value) =>
    value ? matchSorter(options, value, { keys: ['label', 'value'] }) : options

  return (
    <Downshift
      stateReducer={stateReducer}
      itemToString={(item) => {
        return item ? item.label : ''
      }}
    >
      {({
        getLabelProps,
        getInputProps,
        getRootProps,
        getItemProps,
        clearSelection,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <InputRow>
          <label htmlFor={id} {...getLabelProps()}>
            {label}
          </label>
          <div {...getRootProps({}, { suppressRefError: true })}>
            <TypeAHeadInput
              {...getInputProps({
                onChange: (e) => {
                  if (e.target.value === '') {
                    clearSelection()
                  }
                },
              })}
            />
            <MenuList>
              {isOpen ? (
                <>
                  {getItems(inputValue).length > 0 ? (
                    getItems(inputValue).map((item, index) => (
                      <MenuListItem
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                          style: {
                            backgroundColor:
                              highlightedIndex === index
                                ? theme.color.primaryColor
                                : 'white',
                            color:
                              highlightedIndex === index ? 'white' : 'black',
                            fontWeight:
                              selectedItem === item ? 'bold' : 'normal',
                          },
                        })}
                      >
                        {item.label}
                      </MenuListItem>
                    ))
                  ) : (
                    <li
                      style={{
                        backgroundColor: 'white',
                        padding: '4px 10px',
                      }}
                    >
                      No Results
                    </li>
                  )}
                </>
              ) : null}
            </MenuList>
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
}

export default InputAutocomplete
