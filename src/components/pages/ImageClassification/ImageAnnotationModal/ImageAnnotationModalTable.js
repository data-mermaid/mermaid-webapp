import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { imageClassificationPointPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ConfirmedIcon,
  TableWithNoMinWidth,
  TrWithBorderStyling,
} from './ImageAnnotationModal.styles'

const ImageAnnotationModalTable = ({
  points,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
  setDataToReview,
  setHighlightedPoints,
  setSelectedPoints,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState()
  const classifiedPoints = points.filter(({ annotations }) => annotations.length > 0)
  const tableData = Object.groupBy(
    classifiedPoints,
    ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
  )

  const getAttributeGrowthFormLabel = ({ benthic_attribute, growth_form }) =>
    growth_form
      ? `${getBenthicAttributeLabel(benthic_attribute)} / ${getGrowthFormLabel(growth_form)}`
      : getBenthicAttributeLabel(benthic_attribute)

  // Returns true if every point in row has an annotation that has `is_confirmed` set to true
  const checkIfRowIsConfirmed = (row) =>
    tableData[row].every(({ annotations }) => annotations[0].is_confirmed)

  const handleRowSelect = (rowData, index) => {
    if (index === selectedRowIndex) {
      setSelectedRowIndex()
      setSelectedPoints([])
    } else {
      setSelectedRowIndex(index)
      setSelectedPoints(rowData)
    }
  }

  const handleRowConfirm = (e, rowData) => {
    e.stopPropagation()

    const updatedPoints = points.map((point) => {
      const isPointInRow = rowData.some((pointInRow) => pointInRow.id === point.id)
      if (isPointInRow) {
        // TODO: Check if user-created annotation or machine-generated annotation
        // For now, assume machine-generated, update first annotation to confirmed
        point.annotations[0].is_confirmed = true
      }

      return point
    })

    setDataToReview((prevState) => ({ ...prevState, points: updatedPoints }))
    setSelectedRowIndex()
    setSelectedPoints([])
    setHighlightedPoints([])
  }

  return (
    <TableWithNoMinWidth aria-labelledby="table-label">
      <thead>
        <Tr>
          <Th colSpan={2} align="right">
            Count
          </Th>
          <Th>Attribute / Growth Form</Th>
          <Th>Status</Th>
        </Tr>
      </thead>
      <tbody>
        {Object.keys(tableData).map((row, i) => {
          const isRowConfirmed = checkIfRowIsConfirmed(row)

          return (
            <TrWithBorderStyling
              key={row}
              onClick={() => handleRowSelect(tableData[row], i)}
              onMouseEnter={() => setHighlightedPoints(tableData[row])}
              onMouseLeave={() => setHighlightedPoints([])}
              $isSelected={i === selectedRowIndex}
              $isConfirmed={isRowConfirmed}
            >
              <Td align="right">{isRowConfirmed ? <ConfirmedIcon /> : undefined}</Td>
              <Td align="right">{tableData[row].length}</Td>
              {/* All points in a row will have the same benthic attribute / growth form */}
              <Td>{getAttributeGrowthFormLabel(tableData[row][0].annotations[0])}</Td>
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
  )
}

ImageAnnotationModalTable.propTypes = {
  setHighlightedPoints: PropTypes.func.isRequired,
  setSelectedPoints: PropTypes.func.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ImageAnnotationModalTable
