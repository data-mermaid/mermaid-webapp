import React, { Dispatch, SetStateAction } from 'react'
import {
  PopupWrapperForRadio,
  ClickableRowThatLooksLikeAnEvenTr,
} from '../ImageAnnotationModal.styles'
import type {
  ImageClassificationPoint,
  ImageClassificationPointAnnotation,
  ImageClassificationResponse,
} from '../../../../../App/mermaidData/mermaidDataTypes'
import { RowSpaceBetween } from '../../../../generic/positioning'

interface ClassifierGuessesProps {
  selectedPoint: ImageClassificationPoint
  dataToReview: ImageClassificationResponse
  setDataToReview: Dispatch<SetStateAction<ImageClassificationResponse>>
  onPointsChanged: (pointIds: string[]) => void
}

const moveAnnotationToFront = (array: ImageClassificationPointAnnotation[], index: number) => {
  const newArray = [...array]
  const [movedAnnotation] = newArray.splice(index, 1)
  return [movedAnnotation, ...newArray]
}

const ClassifierGuesses = ({
  selectedPoint,
  dataToReview,
  setDataToReview,
  onPointsChanged,
}: ClassifierGuessesProps) => {
  const classifierGuesses = selectedPoint.annotations.filter(
    (annotation) => annotation.is_machine_created,
  )
  const classifierGuessesSortedByScore = classifierGuesses.toSorted((a, b) => b.score - a.score)

  const selectClassifierGuess = (annotationId: string) => {
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
    onPointsChanged([selectedPoint.id])
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

export default ClassifierGuesses
