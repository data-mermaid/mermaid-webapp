import React from 'react'
import PropTypes from 'prop-types'
import {
  PopupWrapperForRadio,
  ClickableRowThatLooksLikeAnEvenTr,
} from '../ImageAnnotationModal.styles'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'
import { RowSpaceBetween } from '../../../../generic/positioning'

const moveAnnotationToFront = (array, index) => {
  const newArray = [...array]
  const [movedAnnotation] = newArray.splice(index, 1)
  return [movedAnnotation, ...newArray]
}

const ClassifierGuesses = ({
  selectedPoint,
  dataToReview,
  setDataToReview,
  setIsDataUpdatedSinceLastSave,
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

    const updatedAnnotationsWithResetConfirmation = updatedAnnotations.map((annotation) => ({
      ...annotation,
      is_confirmed: false,
    }))
    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id
        ? { ...point, annotations: updatedAnnotationsWithResetConfirmation }
        : point,
    )
    setDataToReview({ ...dataToReview, points: updatedPoints })
    setIsDataUpdatedSinceLastSave(true)
  }

  return classifierGuessesSortedByScore.map((annotation) => (
    <ClickableRowThatLooksLikeAnEvenTr key={annotation.id} as="label">
      <PopupWrapperForRadio>
        <input
          type="radio"
          id={annotation.ba_gr}
          name={annotation.ba_gr}
          checked={annotation.ba_gr === selectedPoint.annotations[0].ba_gr}
          onChange={() => selectClassifierGuess(annotation.id)}
        />
      </PopupWrapperForRadio>
      <RowSpaceBetween>
        <span>{annotation.ba_gr_label}</span>
        <span>{annotation.score}%</span>
      </RowSpaceBetween>
    </ClickableRowThatLooksLikeAnEvenTr>
  ))
}

ClassifierGuesses.propTypes = {
  selectedPoint: imageClassificationPointPropType.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
}

export default ClassifierGuesses
