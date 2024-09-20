import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Th, Tr } from '../../../../generic/Table/table'
import { PopupTd, PopupTdForRadio } from '../ImageAnnotationModal.styles'
import { Select } from '../../../../generic/form'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'
import { isAClassifierGuessOfSelectedPoint } from '../../imageClassificationUtilities'

const isClassified = ({ annotations }) => annotations.length > 0

const isOptionAlreadyAdded = (acc, value) => acc.some((option) => option.value === value)

const ExistingRows = ({ selectedPoint, dataToReview, setDataToReview }) => {
  const [selectedExistingRow, setSelectedExistingRow] = useState('')

  const existingRowDropdownOptions = dataToReview.points
    .reduce((acc, currentPoint) => {
      const { ba_gr, ba_gr_label } = currentPoint.annotations[0]

      if (
        isClassified(currentPoint) &&
        !isOptionAlreadyAdded(acc, ba_gr) &&
        !isAClassifierGuessOfSelectedPoint(selectedPoint.annotations, ba_gr)
      ) {
        acc.push({ label: ba_gr_label, value: ba_gr })
      }

      return acc
    }, [])
    .sort((a, b) => a.label.localeCompare(b.label))

  const _updateSelectedRowOnPointAnnotationChange = useEffect(() => {
    const rowKeyForPoint = selectedPoint.annotations[0].ba_gr
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

    const labelForExistingAnnotation = existingRowDropdownOptions.find(
      ({ value }) => value === existingAnnotation,
    )?.label

    const annotationToAdd = {
      ba_gr: existingAnnotation,
      ba_gr_label: labelForExistingAnnotation,
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
        <Th colSpan={4}>Attribute growth form</Th>
      </Tr>
      <Tr>
        <PopupTdForRadio>
          <input
            type="radio"
            id="existing-row-point-selection"
            name="existing-row-point-selection"
            value="existing-row"
            disabled={!selectedExistingRow}
            checked={selectedPoint.annotations[0].ba_gr === selectedExistingRow}
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
}

export default ExistingRows
