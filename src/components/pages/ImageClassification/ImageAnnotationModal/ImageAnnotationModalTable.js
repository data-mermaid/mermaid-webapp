import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td, TableOverflowWrapper } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { imageClassificationPointPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ConfirmedIcon,
  TableWithNoMinWidth,
  TrWithBorderStyling,
} from './ImageAnnotationModal.styles'

const ImageAnnotationModalTable = ({ points, setDataToReview, setHighlightedAttributeId }) => {
  const [selectedRowKey, setSelectedRowKey] = useState()
  const classifiedPoints = points.filter(({ annotations }) => annotations.length > 0)
  const tableData = Object.groupBy(
    classifiedPoints,
    ({ annotations }) => annotations[0].ba_gr_label,
  )

  const checkIfRowIsConfirmed = (rowKey) =>
    tableData[rowKey].every(({ annotations }) => annotations[0].is_confirmed)

  const handleRowSelect = (rowKey) => {
    if (rowKey === selectedRowKey) {
      setSelectedRowKey()
    } else {
      setSelectedRowKey(rowKey)

      const attributeId = tableData[rowKey][0].annotations[0].ba_gr
      setHighlightedAttributeId(attributeId)
    }
  }

  const handleRowHoverOrLeave = (rowKey) => {
    if (selectedRowKey === undefined) {
      const attributeId = rowKey ? tableData[rowKey][0].annotations[0].ba_gr : ''
      setHighlightedAttributeId(attributeId)
    }
  }

  const handleRowConfirm = (e, rowData) => {
    e.stopPropagation()

    const updatedPoints = points.map((point) => {
      const isPointInRow = rowData.some((pointInRow) => pointInRow.id === point.id)
      if (isPointInRow) {
        point.annotations[0].is_confirmed = true
      }

      return point
    })

    setDataToReview((prevState) => ({ ...prevState, points: updatedPoints }))
    setSelectedRowKey()
    setHighlightedAttributeId('')
  }

  return (
    <TableOverflowWrapper id="modal-table">
      <TableWithNoMinWidth aria-labelledby="table-label">
        <thead>
          <Tr>
            <Th colSpan={2} align="right">
              Count
            </Th>
            <Th>Attribute growth form</Th>
            <Th>Status</Th>
          </Tr>
        </thead>
        <tbody>
          {Object.keys(tableData)
            .sort()
            .map((row) => {
              const isRowConfirmed = checkIfRowIsConfirmed(row)

              return (
                <TrWithBorderStyling
                  key={row}
                  onClick={() => handleRowSelect(row)}
                  onMouseEnter={() => handleRowHoverOrLeave(row)}
                  onMouseLeave={() => handleRowHoverOrLeave('')}
                  $isSelected={row === selectedRowKey}
                  $isAnyRowSelected={selectedRowKey !== undefined}
                >
                  <Td align="right">{isRowConfirmed ? <ConfirmedIcon /> : undefined}</Td>
                  <Td align="right">{tableData[row].length}</Td>
                  {/* All points in a row will have the same ba_gr label */}
                  <Td>{tableData[row][0].annotations[0].ba_gr_label}</Td>
                  <Td align="center">
                    {isRowConfirmed ? (
                      'Confirmed'
                    ) : (
                      <ButtonSecondary
                        type="button"
                        onClick={(e) => handleRowConfirm(e, tableData[row])}
                      >
                        Confirm
                      </ButtonSecondary>
                    )}
                  </Td>
                </TrWithBorderStyling>
              )
            })}
        </tbody>
      </TableWithNoMinWidth>
    </TableOverflowWrapper>
  )
}

ImageAnnotationModalTable.propTypes = {
  setHighlightedAttributeId: PropTypes.func.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
}

export default ImageAnnotationModalTable
