import React from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td, TableOverflowWrapper } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { imageClassificationPointPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  TableWithNoMinWidth,
  TdConfirmed,
  TdUnconfirmed,
  TrWithBorderStyling,
} from './ImageAnnotationModal.styles'

const ImageAnnotationModalTable = ({
  points,
  setDataToReview,
  selectedAttributeId,
  setSelectedAttributeId,
  setHoveredAttributeId,
}) => {
  const classifiedPoints = points.filter(({ annotations }) => annotations.length > 0)
  const tableData = Object.groupBy(
    classifiedPoints,
    ({ annotations }) => annotations[0].ba_gr_label,
  )

  const getConfirmedCount = (rowKey) =>
    tableData[rowKey].reduce(
      (count, point) => (point.annotations[0].is_confirmed ? count + 1 : count),
      0,
    )

  const handleRowSelect = (rowId) => {
    if (rowId === selectedAttributeId) {
      setSelectedAttributeId('')
    } else {
      setSelectedAttributeId(rowId)
    }
  }

  const handleRowHoverOrLeave = (rowKey) => {
    const attributeId = rowKey ? tableData[rowKey][0].annotations[0].ba_gr : ''
    setHoveredAttributeId(attributeId)
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
    setSelectedAttributeId('')
  }

  return (
    <TableOverflowWrapper id="annotation-modal-table">
      <TableWithNoMinWidth aria-labelledby="table-label">
        <thead>
          <Tr>
            <Th>Attribute growth form</Th>
            <Th title="Confirmed count">✓</Th>
            <Th title="Unconfirmed count">?</Th>
            <Th>Status</Th>
          </Tr>
        </thead>
        <tbody>
          {Object.keys(tableData)
            .sort()
            .map((row) => {
              const { ba_gr, ba_gr_label } = tableData[row][0].annotations[0]
              const confirmedCount = getConfirmedCount(row)
              const unconfirmedCount = tableData[row].length - confirmedCount

              return (
                <TrWithBorderStyling
                  key={row}
                  onClick={() => handleRowSelect(tableData[row][0].annotations[0].ba_gr)}
                  onMouseEnter={() => handleRowHoverOrLeave(row)}
                  onMouseLeave={() => handleRowHoverOrLeave('')}
                  $isSelected={ba_gr === selectedAttributeId}
                  $isAnyRowSelected={selectedAttributeId !== undefined}
                >
                  {/* All points in a row will have the same ba_gr label */}
                  <Td>{ba_gr_label}</Td>
                  <TdConfirmed $hasConfirmedPoint={!!confirmedCount}>{confirmedCount}</TdConfirmed>
                  <TdUnconfirmed $hasUnconfirmedPoint={!!unconfirmedCount}>
                    {unconfirmedCount}
                  </TdUnconfirmed>
                  <Td align="center">
                    {!unconfirmedCount ? (
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
  selectedAttributeId: PropTypes.string.isRequired,
  setSelectedAttributeId: PropTypes.func.isRequired,
  setHoveredAttributeId: PropTypes.func.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
}

export default ImageAnnotationModalTable
