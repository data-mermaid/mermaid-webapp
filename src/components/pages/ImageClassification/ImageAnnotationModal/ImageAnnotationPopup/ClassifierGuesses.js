import React from 'react'
import PropTypes from 'prop-types'
import { Tr } from '../../../../generic/Table/table'
import { PopupTd, PopupTdForRadio } from '../ImageAnnotationModal.styles'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'

const moveAnnotationToFront = (array, index) => {
  const newArray = [...array]
  newArray.unshift(newArray.splice(index, 1)[0])
  return newArray
}

const confirmFirstAnnotationAndUnconfirmRest = (annotation, i) => {
  if (i === 0) {
    annotation.is_confirmed = true
  } else {
    annotation.is_confirmed = false
  }
}

const ClassifierGuesses = ({
  selectedPoint,
  dataToReview,
  setDataToReview,
  selectedRadioOption,
  setSelectedRadioOption,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
}) => {
  const classifierGuesses = selectedPoint.annotations.filter(
    (annotation) => annotation.is_machine_created,
  )
  const classifierGuessesSortedByScore = classifierGuesses.toSorted((a, b) => b.score - a.score)

  const selectClassifierGuess = (annotationId) => {
    const classifierGuessIndex = classifierGuessesSortedByScore.findIndex(
      (annotation) => annotation.id === annotationId,
    )
    const updatedAnnotations = moveAnnotationToFront(
      classifierGuessesSortedByScore,
      classifierGuessIndex,
    )
    updatedAnnotations.forEach(confirmFirstAnnotationAndUnconfirmRest)
    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )
    setDataToReview({ ...dataToReview, points: updatedPoints })
  }

  return classifierGuessesSortedByScore.map((annotation, i) => (
    <Tr key={annotation.id}>
      <PopupTdForRadio>
        <input
          type="radio"
          id={`${annotation.benthic_attribute}_${annotation.growth_form}`}
          name={`${annotation.benthic_attribute}_${annotation.growth_form}`}
          value={`classifier-guess-${i}`}
          checked={selectedRadioOption === `classifier-guess-${i}`}
          onChange={() => {
            setSelectedRadioOption(`classifier-guess-${i}`)
            selectClassifierGuess(annotation.id)
          }}
        />
      </PopupTdForRadio>
      <PopupTd>{getBenthicAttributeLabel(annotation.benthic_attribute)}</PopupTd>
      <PopupTd>{getGrowthFormLabel(annotation.growth_form)}</PopupTd>
      <PopupTd>{annotation.score}</PopupTd>
    </Tr>
  ))
}

ClassifierGuesses.propTypes = {
  selectedPoint: imageClassificationPointPropType.isRequired,
  selectedRadioOption: PropTypes.string.isRequired,
  setSelectedRadioOption: PropTypes.func.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ClassifierGuesses
