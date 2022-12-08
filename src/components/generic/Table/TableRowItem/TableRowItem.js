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
  isOriginalSiteSelected,
  isDuplicateSiteSelected,
}) => {
  const rowItemValue = options ? getOptionsByItemLabelOrName(value, options) : value
  const extraRowItemValue = options ? getOptionsByItemLabelOrName(extraValue, options) : extraValue
  const showExtraRowItem = extraValue || extraValue === ''
  const highlightedCurrentSite = isOriginalSiteSelected ? 'highlighted' : undefined
  const highlightedDuplicateSite = isDuplicateSiteSelected ? 'highlighted' : undefined

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
  isOriginalSiteSelected: PropTypes.bool,
  isDuplicateSiteSelected: PropTypes.bool,
}

TableRowItem.defaultProps = {
  options: undefined,
  value: undefined,
  extraValue: undefined,
  isOriginalSiteSelected: false,
  isDuplicateSiteSelected: false,
}

export default TableRowItem
