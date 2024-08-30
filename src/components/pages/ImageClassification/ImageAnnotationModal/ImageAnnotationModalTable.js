import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Table, Tr, Th, Td } from '../../../generic/Table/table'
import { ButtonPrimary, ButtonCaution } from '../../../generic/buttons'
import { IconClose } from '../../../icons'
import { imageClassificationPointPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { TrWithBorderStyling } from './ImageAnnotationModal.styles'

const ImageAnnotationModalTable = ({
  points,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
  setDataToReview,
  setHighlightedPoints,
  setSelectedPoints,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState()
  const classifiedPoints = points.filter(
    ({ is_unclassified, annotations }) => !is_unclassified && annotations.length > 0,
  )
  const tableData = Object.groupBy(
    classifiedPoints,
    ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
  )

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

  const handleRowDelete = (e, rowData) => {
    e.stopPropagation()

    const updatedPoints = points.map((point) => {
      const isPointInRow = rowData.some((pointInRow) => pointInRow.id === point.id)
      if (isPointInRow) {
        point.is_unclassified = true
      }

      return point
    })

    setDataToReview((prevState) => ({ ...prevState, points: updatedPoints }))
    setSelectedRowIndex()
    setSelectedPoints([])
    setHighlightedPoints([])
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
    <Table aria-labelledby="table-label">
      <thead>
        <Tr>
          <Th>Benthic Attribute</Th>
          <Th>Growth Form</Th>
          <Th align="right">Number of Points</Th>
          <Th />
          <Th />
        </Tr>
      </thead>
      <tbody>
        {Object.keys(tableData).map((row, i) => (
          <TrWithBorderStyling
            key={row}
            onClick={() => handleRowSelect(tableData[row], i)}
            onMouseEnter={() => setHighlightedPoints(tableData[row])}
            onMouseLeave={() => setHighlightedPoints([])}
            $isSelected={i === selectedRowIndex}
            $isConfirmed={checkIfRowIsConfirmed(row)}
          >
            {/* All points in a row will have the same benthic attribute / growth form */}
            <Td>{getBenthicAttributeLabel(tableData[row][0].annotations[0].benthic_attribute)}</Td>
            <Td>{getGrowthFormLabel(tableData[row][0].annotations[0].growth_form)}</Td>
            <Td align="right">{tableData[row].length}</Td>
            <Td align="center">
              {checkIfRowIsConfirmed(row) ? (
                'Confirmed'
              ) : (
                <ButtonPrimary type="button" onClick={(e) => handleRowConfirm(e, tableData[row])}>
                  Confirm
                </ButtonPrimary>
              )}
            </Td>
            <Td align="center">
              <ButtonCaution type="button" onClick={(e) => handleRowDelete(e, tableData[row])}>
                <IconClose />
              </ButtonCaution>
            </Td>
          </TrWithBorderStyling>
        ))}
      </tbody>
    </Table>
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
