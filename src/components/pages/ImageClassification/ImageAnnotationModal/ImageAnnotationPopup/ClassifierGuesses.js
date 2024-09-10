import React from 'react'
import PropTypes from 'prop-types'
import { Tr } from '../../../../generic/Table/table'
import { PopupTd, PopupTdForRadio } from '../ImageAnnotationModal.styles'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'

const moveItemToFront = (array, index) => {
  const newArray = [...array]
  newArray.unshift(newArray.splice(index, 1)[0])
  return newArray
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
  const annotationsSortedByScore = selectedPoint.annotations.toSorted((a, b) => b.score - a.score)

  const selectClassifierGuess = (classifierGuessIndex) => {
    // TODO: Un-confirm any previously confirmed annotations
    const updatedAnnotations = moveItemToFront(selectedPoint.annotations, classifierGuessIndex)
    updatedAnnotations[0].is_confirmed = true // auto-confirm
    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )
    setDataToReview({ ...dataToReview, points: updatedPoints })
  }

  return annotationsSortedByScore.map((annotation, i) => (
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
            selectClassifierGuess(i)
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
