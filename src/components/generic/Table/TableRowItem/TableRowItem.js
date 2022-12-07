import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import language from '../../../../language'
import { getObjectById } from '../../../../library/getObjectById'
import { Tr, Td } from '../table'

const TdKey = styled(Td)`
  white-space: nowrap;
  font-weight: 900;
  width: 0;
`

const getItemLabelOrName = (itemOptions, itemValue) =>
  getObjectById(itemOptions, itemValue)?.name || getObjectById(itemOptions, itemValue)?.label

const getOptionsByItemLabelOrName = (rowValue, options) => {
  return Array.isArray(rowValue)
    ? rowValue.map((item) => getItemLabelOrName(options, item)).join(', ')
    : getItemLabelOrName(options, rowValue)
}

const TableRowItem = ({ title, options, value, extraValue, recordToBeReplaced }) => {
  const { thisSite, anotherSite } = language.resolveModal
  const rowItemValue = options ? getOptionsByItemLabelOrName(value, options) : value
  const extraRowItemValue = options ? getOptionsByItemLabelOrName(extraValue, options) : extraValue
  const showExtraRowItem = extraValue || extraValue === ''
  const highlightedCurrentSite = recordToBeReplaced === thisSite ? 'highlighted' : undefined
  const highlightedDuplicateSite = recordToBeReplaced === anotherSite ? 'highlighted' : undefined

  return (
    <Tr>
      <TdKey>{title}</TdKey>
      <Td className={highlightedDuplicateSite}>{rowItemValue}</Td>
      {showExtraRowItem && <Td className={highlightedCurrentSite}>{extraRowItemValue}</Td>}
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
  extraValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  recordToBeReplaced: PropTypes.string,
}

TableRowItem.defaultProps = {
  options: undefined,
  value: undefined,
  extraValue: undefined,
  recordToBeReplaced: undefined,
}

export default TableRowItem
