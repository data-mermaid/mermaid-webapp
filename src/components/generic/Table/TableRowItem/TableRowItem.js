import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import { getObjectById } from '../../../../library/getObjectById'
import { Tr, Td } from '../table'

const TdKey = styled(Td)`
  white-space: nowrap;
  font-weight: 900;
  width: 0;
`
const getItemLabelOrName = (itemOptions, itemValue) =>
  getObjectById(itemOptions, itemValue)?.name || getObjectById(itemOptions, itemValue)?.label

const TableRowItem = ({ title, options, value }) => {
  const optionNameOrLabel = Array.isArray(value)
    ? value.map((item) => getItemLabelOrName(options, item)).join(', ')
    : getItemLabelOrName(options, value)

  const rowItemValue = options ? optionNameOrLabel : value

  return (
    <Tr>
      <TdKey>{title}</TdKey>
      <Td>{rowItemValue}</Td>
    </Tr>
  )
}

TableRowItem.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
  ]),
}

TableRowItem.defaultProps = {
  options: undefined,
  value: undefined,
}

export default TableRowItem
