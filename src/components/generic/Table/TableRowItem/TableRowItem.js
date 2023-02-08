import PropTypes from 'prop-types'
import React from 'react'
import { getObjectById } from '../../../../library/getObjectById'
import { Tr, TableRowTdKey, TableRowTd } from '../table'

const getItemLabelOrName = (itemOptions, itemValue) =>
  getObjectById(itemOptions, itemValue)?.name || getObjectById(itemOptions, itemValue)?.label

const getOptionsByItemLabelOrName = (rowValue, options) => {
  return Array.isArray(rowValue)
    ? rowValue.map((item) => getItemLabelOrName(options, item)).join(', ')
    : getItemLabelOrName(options, rowValue)
}

const TableRowItem = ({
  title,
  options,
  value,
  extraValue,
  isOriginalSelected,
  isDuplicateSelected,
  isAllowNewlines,
}) => {
  const rowItemValue = options ? getOptionsByItemLabelOrName(value, options) : value
  const extraRowItemValue = options ? getOptionsByItemLabelOrName(extraValue, options) : extraValue
  const hasExtraRowForDuplicateRecord = extraValue !== undefined
  const highlightedCurrentSite = isOriginalSelected ? 'highlighted' : undefined
  const highlightedDuplicateSite = isDuplicateSelected ? 'highlighted' : undefined

  return (
    <Tr>
      <TableRowTdKey>{title}</TableRowTdKey>
      <TableRowTd hightedBackground={highlightedDuplicateSite} isAllowNewLines={isAllowNewlines}>
        {rowItemValue}
      </TableRowTd>
      {hasExtraRowForDuplicateRecord && (
        <TableRowTd hightedBackground={highlightedCurrentSite} isAllowNewLines={isAllowNewlines}>
          {extraRowItemValue}
        </TableRowTd>
      )}
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
  isOriginalSelected: PropTypes.bool,
  isDuplicateSelected: PropTypes.bool,
  isAllowNewlines: PropTypes.bool,
}

TableRowItem.defaultProps = {
  options: undefined,
  value: undefined,
  extraValue: undefined,
  isOriginalSelected: false,
  isDuplicateSelected: false,
  isAllowNewlines: false,
}

export default TableRowItem
