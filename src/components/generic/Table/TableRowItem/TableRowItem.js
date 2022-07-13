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

const TableRowItem = ({ title, options, value }) => {
  const optionNameOrLabel =
    getObjectById(options, value)?.name || getObjectById(options, value)?.label
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

TableRowItem.defaultProps = {
  options: undefined,
  value: undefined,
}

export default TableRowItem
