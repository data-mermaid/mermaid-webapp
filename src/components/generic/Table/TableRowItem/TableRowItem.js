import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProjectIdFromLocation } from '../../../../library/getProjectIdFromLocation'
import { getObjectById } from '../../../../library/getObjectById'
import { Tr, TableRowTdKey, TableRowTd } from '../table'
import { ButtonThatLooksLikeLinkUnderlined } from '../../buttons'

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
  isLink,
}) => {
  const rowItemValue = options ? getOptionsByItemLabelOrName(value, options) : value
  const extraRowItemValue = options ? getOptionsByItemLabelOrName(extraValue, options) : extraValue
  const hasExtraRowForDuplicateRecord = extraValue !== undefined
  const highlightedCurrentSite = isOriginalSelected ? 'highlighted' : undefined
  const highlightedDuplicateSite = isDuplicateSelected ? 'highlighted' : undefined

  const navigate = useNavigate()
  const location = useLocation()

  const projectId = getProjectIdFromLocation(location)

  const handleViewLinkClick = (event, linkType, linkValue) => {
    event.stopPropagation()
    let navLink

    if (linkType === 'Site') {
      navLink = `/projects/${projectId}/sites/${linkValue}`

      navigate(navLink)
    } else if (linkType === 'Management') {
      navLink = `/projects/${projectId}/management-regimes/${linkValue}`

      navigate(navLink)
    }

    return
  }

  return (
    <Tr>
      <TableRowTdKey>{title}</TableRowTdKey>
      {isLink ? (
        <TableRowTd hightedBackground={highlightedDuplicateSite} isAllowNewLines={isAllowNewlines}>
          <ButtonThatLooksLikeLinkUnderlined
            type="button"
            onClick={(event) => handleViewLinkClick(event, title, value)}
          >
            {rowItemValue}
          </ButtonThatLooksLikeLinkUnderlined>
        </TableRowTd>
      ) : (
        <TableRowTd hightedBackground={highlightedDuplicateSite} isAllowNewLines={isAllowNewlines}>
          {rowItemValue}
        </TableRowTd>
      )}
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
  isLink: PropTypes.bool,
}

TableRowItem.defaultProps = {
  options: undefined,
  value: undefined,
  extraValue: undefined,
  isOriginalSelected: false,
  isDuplicateSelected: false,
  isAllowNewlines: false,
  isLink: false,
}

export default TableRowItem
