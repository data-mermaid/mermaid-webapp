import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { getProjectIdFromLocation } from '../../../../library/getProjectIdFromLocation'
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
  options = undefined,
  value = undefined,
  extraValue = undefined,
  isOriginalSelected = false,
  isDuplicateSelected = false,
  isAllowNewlines = false,
  isLink = false,
}) => {
  const rowItemValue = options ? getOptionsByItemLabelOrName(value, options) : value
  const extraRowItemValue = options ? getOptionsByItemLabelOrName(extraValue, options) : extraValue
  const hasExtraRowForDuplicateRecord = extraValue !== undefined
  const highlightedCurrentSite = isOriginalSelected ? 'highlighted' : undefined
  const highlightedDuplicateSite = isDuplicateSelected ? 'highlighted' : undefined

  const location = useLocation()

  const projectId = getProjectIdFromLocation(location)

  const linkToSiteOrMR = `/projects/${projectId}/${
    title === 'Site' ? 'sites' : 'management-regimes'
  }/${value}`

  return (
    <Tr>
      <TableRowTdKey>{title}</TableRowTdKey>
      {isLink ? (
        <TableRowTd
          $hightedBackground={highlightedDuplicateSite}
          $isAllowNewLines={isAllowNewlines}
        >
          <a href={linkToSiteOrMR}>{rowItemValue}</a>
        </TableRowTd>
      ) : (
        <TableRowTd
          $hightedBackground={highlightedDuplicateSite}
          $isAllowNewLines={isAllowNewlines}
        >
          {rowItemValue}
        </TableRowTd>
      )}
      {hasExtraRowForDuplicateRecord && (
        <TableRowTd $hightedBackground={highlightedCurrentSite} $isAllowNewLines={isAllowNewlines}>
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
  isLink: PropTypes.bool,
}

export default TableRowItem
