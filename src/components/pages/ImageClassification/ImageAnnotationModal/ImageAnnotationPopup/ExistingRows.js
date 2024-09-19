import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Th, Tr } from '../../../../generic/Table/table'
import { PopupTd, PopupTdForRadio } from '../ImageAnnotationModal.styles'
import { Select } from '../../../../generic/form'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'

const isClassified = ({ annotations }) => annotations.length > 0

const isAClassifierGuessOfSelectedPoint = (annotations, benthic_attribute, growth_form) =>
  annotations.some(
    (annotation) =>
      annotation.is_machine_created &&
      annotation.benthic_attribute === benthic_attribute &&
      annotation.growth_form === growth_form,
  )

const isOptionAlreadyAdded = (acc, value) => acc.some((option) => option.value === value)

const ExistingRows = ({
  selectedPoint,
  dataToReview,
  setDataToReview,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
}) => {
  const [selectedExistingRow, setSelectedExistingRow] = useState('')

  const existingRowDropdownOptions = dataToReview.points.reduce((acc, currentPoint) => {
    const { benthic_attribute, growth_form } = currentPoint.annotations[0]
    const value = benthic_attribute + '_' + growth_form
    const label = `${getBenthicAttributeLabel(benthic_attribute)} ${getGrowthFormLabel(
      growth_form,
    )}`

    if (
      isClassified(currentPoint) &&
      !isOptionAlreadyAdded(acc, value) &&
      !isAClassifierGuessOfSelectedPoint(selectedPoint.annotations, benthic_attribute, growth_form)
    ) {
      acc.push({ label, value })
    }

    return acc
  }, [])

  const _updateSelectedRowOnPointAnnotationChange = useEffect(() => {
    const { benthic_attribute, growth_form } = selectedPoint.annotations[0]
    const rowKeyForPoint = benthic_attribute + '_' + growth_form
    const isPointInARow = existingRowDropdownOptions.some((row) => rowKeyForPoint === row.value)

    setSelectedExistingRow((prevState) => (isPointInARow ? rowKeyForPoint : prevState))
  }, [selectedPoint.annotations, existingRowDropdownOptions])

  const addExistingAnnotation = (existingAnnotation) => {
    const [benthic_attribute, growth_form] = existingAnnotation.split('_')

    // Only want classifier guesses, and want them unconfirmed.
    const resetAnnotationsForPoint = selectedPoint.annotations.reduce((acc, currentAnnotation) => {
      if (currentAnnotation.is_machine_created) {
        acc.push({ ...currentAnnotation, is_confirmed: false })
      }

      return acc
    }, [])

    const annotationToAdd = {
      benthic_attribute,
      growth_form: growth_form === 'null' ? null : growth_form,
      is_confirmed: true,
      is_machine_created: false,
    }

    const updatedAnnotations = [annotationToAdd, ...resetAnnotationsForPoint]

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )
    setDataToReview({ ...dataToReview, points: updatedPoints })
  }

  return (
    <>
      <Tr>
        <Th colSpan={4}>Attribute / Growth Form</Th>
      </Tr>
      <Tr>
        <PopupTdForRadio>
          <input
            type="radio"
            id="existing-row-point-selection"
            name="existing-row-point-selection"
            value="existing-row"
            disabled={!selectedExistingRow}
            checked={
              `${selectedPoint.annotations[0].benthic_attribute}_${selectedPoint.annotations[0].growth_form}` ===
              selectedExistingRow
            }
            onChange={() => addExistingAnnotation(selectedExistingRow)}
          />
        </PopupTdForRadio>
        <PopupTd colSpan={3}>
          <Select
            label="Add to existing row"
            value={selectedExistingRow}
            onChange={(e) => addExistingAnnotation(e.target.value)}
          >
            <option value="" disabled>
              Choose...
            </option>
            {existingRowDropdownOptions.map((row) => (
              <option key={row.value} value={row.value}>
                {row.label}
              </option>
            ))}
          </Select>
        </PopupTd>
      </Tr>
    </>
  )
}

ExistingRows.propTypes = {
  selectedPoint: imageClassificationPointPropType.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ExistingRows
