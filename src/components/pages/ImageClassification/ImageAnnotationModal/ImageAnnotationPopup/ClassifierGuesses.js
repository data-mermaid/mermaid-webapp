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
  const [movedAnnotation] = newArray.splice(index, 1)
  return [movedAnnotation, ...newArray]
}

const confirmFirstAnnotationAndUnconfirmRest = (annotation, i) => {
  annotation.is_confirmed = i === 0
}

const isAnnotationSelected = (annotation, selectedPoint) => {
  const { benthic_attribute, growth_form } = annotation
  const selectedAnnotation = selectedPoint.annotations[0]
  return (
    benthic_attribute === selectedAnnotation.benthic_attribute &&
    growth_form === selectedAnnotation.growth_form
  )
}

const ClassifierGuesses = ({
  selectedPoint,
  dataToReview,
  setDataToReview,
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
          checked={isAnnotationSelected(annotation, selectedPoint)}
          onChange={() => {
            selectClassifierGuess(annotation.id)
          }}
        />
      </PopupTdForRadio>
      <PopupTd>
        {getBenthicAttributeLabel(annotation.benthic_attribute)}{' '}
        {getGrowthFormLabel(annotation.growth_form)}
      </PopupTd>
      <PopupTd align="right">{annotation.score}%</PopupTd>
    </Tr>
  ))
}

ClassifierGuesses.propTypes = {
  selectedPoint: imageClassificationPointPropType.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ClassifierGuesses
