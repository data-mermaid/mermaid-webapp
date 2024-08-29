import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { imageClassificationResponsePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { PopupSubTh, PopupTable } from './ImageAnnotationModal.styles'
import { Select } from '../../../generic/form'

const ImageAnnotationPopup = ({
  dataToReview,
  pointId,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
}) => {
  const point = dataToReview.points.find((point) => point.id === pointId)
  const classifiedPoints = dataToReview.points.filter(
    ({ is_unclassified, annotations }) => !is_unclassified && annotations.length > 0,
  )
  const tableData = Object.groupBy(
    classifiedPoints,
    ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
  )

  const [selectedRow, setSelectedRow] = useState(() => {
    const rowKeyForPoint =
      point.annotations[0].benthic_attribute + '_' + point.annotations[0].growth_form
    const isPointInARow = Object.keys(tableData).some((row) => rowKeyForPoint === row)
    return isPointInARow ? rowKeyForPoint : ''
  })

  return (
    <PopupTable aria-labelledby="table-label">
      <thead>
        <Tr>
          <Th>Benthic Attribute</Th>
          <Th>Growth Form</Th>
          <Th>Confidence</Th>
        </Tr>
      </thead>
      <tbody>
        <Tr>
          <PopupSubTh colSpan={3}>Classifier Guesses</PopupSubTh>
        </Tr>
        {point.annotations.map((annotation) => (
          <Tr key={annotation.id}>
            <Td>{getBenthicAttributeLabel(annotation.benthic_attribute)}</Td>
            <Td>{getGrowthFormLabel(annotation.growth_form)}</Td>
            <Td>{annotation.score}</Td>
          </Tr>
        ))}
        <Tr>
          <PopupSubTh colSpan={3}>Add to existing row</PopupSubTh>
        </Tr>
        <Tr>
          <Td colSpan={3}>
            <Select
              label="Add to existing row"
              value={selectedRow}
              onChange={(e) => setSelectedRow(e.target.value)}
            >
              {Object.keys(tableData).map((row) => {
                // All points in a row will have the same benthic attribute / growth form
                const { benthic_attribute, growth_form } = tableData[row][0].annotations[0]
                return (
                  <option key={row} value={row}>
                    {getBenthicAttributeLabel(benthic_attribute)}
                    {getGrowthFormLabel(growth_form)}
                  </option>
                )
              })}
            </Select>
          </Td>
        </Tr>
        <Tr>
          <PopupSubTh colSpan={3}>New row</PopupSubTh>
        </Tr>
        <Tr>
          <Td colSpan={3}>
            <ButtonSecondary>Choose Attribute</ButtonSecondary>
          </Td>
        </Tr>
      </tbody>
    </PopupTable>
  )
}

ImageAnnotationPopup.propTypes = {
  dataToReview: imageClassificationResponsePropType.isRequired,
  pointId: PropTypes.string.isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ImageAnnotationPopup
