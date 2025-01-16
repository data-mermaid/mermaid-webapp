import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th } from '../../../../generic/Table/table'
import { imageClassificationResponsePropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { databaseSwitchboardPropTypes } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SelectAttributeFromClassifierGuesses from './SelectAttributeFromClassifierGuesses'
import ClassifierGuesses from './ClassifierGuesses'
import {
  EditPointPopupTable,
  PopupBottomRow,
  PopupConfirmButton,
} from '../ImageAnnotationModal.styles'
import './ImageAnnotationPopup.css'

const ImageAnnotationPopup = ({
  dataToReview,
  setDataToReview,
  pointId,
  databaseSwitchboardInstance,
  setIsDataUpdatedSinceLastSave,
  closePopup,
}) => {
  const selectedPoint = dataToReview.points.find((point) => point.id === pointId)
  const isSelectedPointConfirmed = selectedPoint.annotations[0]?.is_confirmed
  const isSelectedPointUnclassified = selectedPoint.annotations.length === 0

  const confirmPoint = useCallback(
    (pointId) => {
      const updatedPoints = dataToReview.points.map((point) => {
        if (point.id !== pointId) {
          return point
        }

        const updatedAnnotations = point.annotations.map((annotation, index) => {
          return { ...annotation, is_confirmed: index === 0 } // we want only one annotation at a time to be confirmed.
        })

        return {
          ...point,
          annotations: updatedAnnotations,
        }
      })

      setDataToReview((previousState) => ({ ...previousState, points: updatedPoints }))
      setIsDataUpdatedSinceLastSave(true)
      closePopup()
    },
    [closePopup, dataToReview.points, setDataToReview, setIsDataUpdatedSinceLastSave],
  )

  return (
    <>
      <EditPointPopupTable aria-labelledby="table-label">
        <thead>
          <Tr>
            <Th colSpan={2}>Classifier Guesses</Th>
            <Th align="right">Confidence</Th>
          </Tr>
        </thead>
        <tbody>
          <ClassifierGuesses
            selectedPoint={selectedPoint}
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
          />
          <SelectAttributeFromClassifierGuesses
            selectedPoint={selectedPoint}
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
            databaseSwitchboardInstance={databaseSwitchboardInstance}
          />
        </tbody>
      </EditPointPopupTable>
      <PopupBottomRow>
        <PopupConfirmButton
          type="button"
          onClick={() => confirmPoint(selectedPoint.id)}
          disabled={isSelectedPointConfirmed || isSelectedPointUnclassified}
        >
          Confirm
        </PopupConfirmButton>
      </PopupBottomRow>
    </>
  )
}

ImageAnnotationPopup.propTypes = {
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  pointId: PropTypes.string.isRequired,
  databaseSwitchboardInstance: databaseSwitchboardPropTypes,
  setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired,
}

export default ImageAnnotationPopup
