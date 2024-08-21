import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table, Tr, Th, Td } from '../../../generic/Table/table'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import { ButtonPrimary, ButtonCaution } from '../../../generic/buttons'
import { IconClose } from '../../../icons'

const TrWithBorderStyling = styled(Tr)`
  border: ${({ $isSelected }) => $isSelected && `2px solid ${COLORS.current}`};
  background-color: ${({ $isConfirmed }) => $isConfirmed && `${COLORS.confirmed} !important`};

  &:hover {
    border: ${({ $isSelected }) => !$isSelected && `2px solid ${COLORS.highlighted}`};
  }
`

const ImageAnnotationModalTable = ({
  points,
  growthForms,
  benthicAttributes,
  setDataToReview,
  setHighlightedPoints,
  setSelectedPoints,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState()
  const pointsWithAnnotations = points.filter(({ annotations }) => annotations.length)
  const tableData = Object.groupBy(
    pointsWithAnnotations,
    ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
  )

  // Returns true if every point in row has an annotation that has `is_confirmed` set to true
  const checkIfRowIsConfirmed = (row) =>
    tableData[row].every(({ annotations }) => annotations[0].is_confirmed)

  const getBenthicAttributeLabel = (row) => {
    const benthicAttributeId = tableData[row][0].annotations[0].benthic_attribute
    const matchingBenthicAttribute = benthicAttributes.find(({ id }) => id === benthicAttributeId)
    return matchingBenthicAttribute?.name
  }

  const getGrowthFormLabel = (row) => {
    const growthFormId = tableData[row][0].annotations[0].growth_form
    const matchingGrowthForm = growthForms.find(({ id }) => id === growthFormId)
    return matchingGrowthForm?.name
  }

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
      return isPointInRow ? { ...point, annotations: [] } : point
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
            <Td>{getBenthicAttributeLabel(row)}</Td>
            <Td>{getGrowthFormLabel(row)}</Td>
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
  points: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired,
      annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
  ),
  benthicAttributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  growthForms: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default ImageAnnotationModalTable
