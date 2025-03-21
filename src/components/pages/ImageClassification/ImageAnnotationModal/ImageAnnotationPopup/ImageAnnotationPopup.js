import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { imageClassificationResponsePropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { databaseSwitchboardPropTypes } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SelectAttributeFromClassifierGuesses from './SelectAttributeFromClassifierGuesses'
import ClassifierGuesses from './ClassifierGuesses'
import {
  EditPointPopupWrapper,
  PointPopupSectionHeader,
  PopupBottomRow,
  PopupConfirmButton,
  PopupIconButton,
  PopupZoomButtonContainer,
} from '../ImageAnnotationModal.styles'
import './ImageAnnotationPopup.css'
import { IconArrowRight, IconZoomIn, IconZoomOut } from '../../../../icons'
import { Tooltip } from '../../../../generic/tooltip'

const ImageAnnotationPopup = ({
  dataToReview,
  setDataToReview,
  pointId,
  databaseSwitchboardInstance,
  setIsDataUpdatedSinceLastSave,
  resetZoom,
  zoomToSelectedPoint,
  selectNextUnconfirmedPoint,
}) => {
  const selectedPoint = dataToReview.points.find((point) => point.id === pointId)
  const isSelectedPointConfirmed = selectedPoint.annotations[0]?.is_confirmed
  const areAnyClassifierGuesses = !!selectedPoint.annotations.filter(
    (annotation) => annotation.is_machine_created,
  ).length

  const isSelectedPointUnclassified = selectedPoint.annotations.length === 0
  const areAllPointsConfirmed = dataToReview.points.every(
    (point) => point.annotations[0]?.is_confirmed,
  )

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
    },
    [dataToReview.points, setDataToReview, setIsDataUpdatedSinceLastSave],
  )

  return (
    <>
      {areAnyClassifierGuesses ? (
        <EditPointPopupWrapper aria-labelledby="table-label">
          <PointPopupSectionHeader>
            <span>Classifier Guesses</span>
            <span>Confidence</span>
          </PointPopupSectionHeader>

          <ClassifierGuesses
            selectedPoint={selectedPoint}
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
          />
        </EditPointPopupWrapper>
      ) : null}
      <SelectAttributeFromClassifierGuesses
        selectedPoint={selectedPoint}
        dataToReview={dataToReview}
        setDataToReview={setDataToReview}
        setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
        databaseSwitchboardInstance={databaseSwitchboardInstance}
      />

      <PopupBottomRow>
        <PopupZoomButtonContainer>
          <PopupIconButton type="button" onClick={resetZoom}>
            <IconZoomOut />
          </PopupIconButton>
          <PopupIconButton type="button" onClick={zoomToSelectedPoint}>
            <IconZoomIn />
          </PopupIconButton>
        </PopupZoomButtonContainer>

        <PopupConfirmButton
          type="button"
          onClick={() => confirmPoint(selectedPoint.id)}
          disabled={isSelectedPointConfirmed || isSelectedPointUnclassified}
        >
          {isSelectedPointConfirmed ? 'Confirmed' : 'Confirm'}
        </PopupConfirmButton>
        <PopupZoomButtonContainer>
          <Tooltip tooltipText="Next Unconfirmed Point" id="next-unconfirmed-point">
            <PopupIconButton
              type="button"
              onClick={selectNextUnconfirmedPoint}
              disabled={areAllPointsConfirmed}
            >
              <IconArrowRight />
            </PopupIconButton>
          </Tooltip>
        </PopupZoomButtonContainer>
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
  resetZoom: PropTypes.func.isRequired,
  zoomToSelectedPoint: PropTypes.func.isRequired,
  selectNextUnconfirmedPoint: PropTypes.func.isRequired,
}

export default ImageAnnotationPopup
