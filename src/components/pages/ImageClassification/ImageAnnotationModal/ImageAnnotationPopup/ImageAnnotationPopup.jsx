import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { imageClassificationResponsePropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { databaseSwitchboardPropTypes } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SelectAttributeFromClassifierGuesses from './SelectAttributeFromClassifierGuesses'
import ClassifierGuesses from './ClassifierGuesses'
import {
  PointPopupSectionHeader,
  PopupBottomRow,
  PopupConfirmButton,
  PopupIconButton,
  PopupZoomButtonContainer,
} from '../ImageAnnotationModal.styles'
import './ImageAnnotationPopup.css'
import { IconArrowRight, IconZoomIn, IconZoomOut } from '../../../../icons'
import { MuiTooltipDark } from '../../../../generic/MuiTooltip'
import language from '../../../../../language'

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
        <div aria-labelledby="table-label">
          <PointPopupSectionHeader>
            {/**Needs plurals**/}
            <span>{language.imageClassification.classifierGuesses}</span>
            <span>{language.imageClassification.confidence}</span>
          </PointPopupSectionHeader>

          <ClassifierGuesses
            selectedPoint={selectedPoint}
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
          />
        </div>
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
          <MuiTooltipDark title="Reset zoom">
            <PopupIconButton type="button" onClick={resetZoom}>
              <IconZoomOut />
            </PopupIconButton>
          </MuiTooltipDark>
          <MuiTooltipDark title="Zoom to point">
            <PopupIconButton type="button" onClick={zoomToSelectedPoint}>
              <IconZoomIn />
            </PopupIconButton>
          </MuiTooltipDark>
        </PopupZoomButtonContainer>

        <PopupConfirmButton
          type="button"
          onClick={() => confirmPoint(selectedPoint.id)}
          disabled={isSelectedPointConfirmed || isSelectedPointUnclassified}
        >
          {isSelectedPointConfirmed ? 'Confirmed' : 'Confirm'}
        </PopupConfirmButton>

        <PopupZoomButtonContainer>
          <MuiTooltipDark title="Next unconfirmed point">
            <PopupIconButton
              type="button"
              onClick={selectNextUnconfirmedPoint}
              disabled={areAllPointsConfirmed}
            >
              <IconArrowRight />
            </PopupIconButton>
          </MuiTooltipDark>
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
