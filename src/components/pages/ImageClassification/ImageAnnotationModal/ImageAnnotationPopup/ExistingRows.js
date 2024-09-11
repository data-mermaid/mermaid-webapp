import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tr } from '../../../../generic/Table/table'
import { PopupTd, PopupTdForRadio } from '../ImageAnnotationModal.styles'
import { Select } from '../../../../generic/form'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'

const confirmFirstAnnotationAndUnconfirmRest = (annotation, i) => {
  if (i === 0) {
    annotation.is_confirmed = true
  } else {
    annotation.is_confirmed = false
  }
}

const isClassified = ({ is_unclassified, annotations }) =>
  !is_unclassified && annotations.length > 0

const isAClassifierGuess = (classifierGuesses, benthic_attribute, growth_form) =>
  classifierGuesses.some(
    (classifierGuess) =>
      !!classifierGuess.is_machine_created &&
      classifierGuess.benthic_attribute === benthic_attribute &&
      classifierGuess.growth_form === growth_form,
  )

const isAlreadyPushed = (acc, value) => acc.some((option) => option.value === value)

const ExistingRows = ({
  selectedPoint,
  dataToReview,
  setDataToReview,
  selectedRadioOption,
  setSelectedRadioOption,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
}) => {
  const existingRowDropdownOptions = dataToReview.points.reduce((acc, currentPoint) => {
    const { benthic_attribute, growth_form } = currentPoint.annotations[0]
    const value = benthic_attribute + '_' + growth_form
    const label = `${getBenthicAttributeLabel(benthic_attribute)} ${getGrowthFormLabel(
      growth_form,
    )}`

    if (
      isClassified(currentPoint) &&
      !isAClassifierGuess(selectedPoint.annotations, benthic_attribute, growth_form) &&
      !isAlreadyPushed(acc, value)
    ) {
      acc.push({ label: label, value: value })
    }

    return acc
  }, [])

  const [selectedExistingRow, setSelectedExistingRow] = useState(() => {
    const rowKeyForPoint =
      selectedPoint.annotations[0].benthic_attribute +
      '_' +
      selectedPoint.annotations[0].growth_form
    const isPointInARow = existingRowDropdownOptions.some((row) => rowKeyForPoint === row.value)
    return isPointInARow ? rowKeyForPoint : ''
  })

  const addExistingAnnotation = (existingAnnotation) => {
    const [benthic_attribute, growth_form] = existingAnnotation.split('_')
    const classifierGuesses = selectedPoint.annotations.filter(
      (annotation) => annotation.is_machine_created,
    )
    const updatedAnnotations = [
      {
        benthic_attribute,
        growth_form: growth_form === 'null' ? null : growth_form,
      },
      ...classifierGuesses,
    ]
    updatedAnnotations.forEach(confirmFirstAnnotationAndUnconfirmRest)

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id
        ? { ...point, is_unclassified: false, annotations: updatedAnnotations }
        : point,
    )
    setDataToReview({ ...dataToReview, points: updatedPoints })
  }

  return (
    <Tr>
      <PopupTdForRadio>
        <input
          type="radio"
          id="existing-row-point-selection"
          name="existing-row-point-selection"
          value="existing-row"
          checked={selectedRadioOption === 'existing-row'}
          onChange={() => {
            setSelectedRadioOption('existing-row')
            addExistingAnnotation(selectedExistingRow)
          }}
        />
      </PopupTdForRadio>
      <PopupTd colSpan={3}>
        <Select
          label="Add to existing row"
          value={selectedExistingRow}
          onChange={(e) => {
            setSelectedExistingRow(e.target.value)
            setSelectedRadioOption('existing-row')
            addExistingAnnotation(e.target.value)
          }}
        >
          {existingRowDropdownOptions.map((row) => (
            <option key={row.value} value={row.value}>
              {row.label}
            </option>
          ))}
        </Select>
      </PopupTd>
    </Tr>
  )
}

ExistingRows.propTypes = {
  selectedPoint: imageClassificationPointPropType.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  selectedRadioOption: PropTypes.string.isRequired,
  setSelectedRadioOption: PropTypes.func.isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ExistingRows
