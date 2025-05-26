import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {imageClassificationResponsePropType} from '../../../../../App/mermaidData/mermaidDataProptypes'
import {databaseSwitchboardPropTypes} from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
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
import {IconArrowRight, IconZoomIn, IconZoomOut} from '../../../../icons'
import {MuiTooltipDark} from '../../../../generic/MuiTooltip'
import {unclassifiedGuid} from '../../../../../library/constants/constants'
import {useTranslation} from 'react-i18next'

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
    const {t} = useTranslation()
    const selectedPoint = dataToReview.points.find((point) => point.id === pointId)
    const isSelectedPointConfirmed = selectedPoint.annotations[0]?.is_confirmed
    const areAnyClassifierGuesses = selectedPoint.annotations.filter(
        (annotation) => annotation.is_machine_created,
    ).length

    const isSelectedPointUnclassified = selectedPoint.annotations[0].ba_gr === unclassifiedGuid
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
                    return {...annotation, is_confirmed: index === 0} // we want only one annotation at a time to be confirmed.
                })

                return {
                    ...point,
                    annotations: updatedAnnotations,
                }
            })

            setDataToReview((previousState) => ({...previousState, points: updatedPoints}))
            setIsDataUpdatedSinceLastSave(true)
        },
        [dataToReview.points, setDataToReview, setIsDataUpdatedSinceLastSave],
    )

    return (
        <>
            {!!areAnyClassifierGuesses && (
                <div aria-labelledby="table-label">
                    <PointPopupSectionHeader>
            <span>
              {t('image_classification.classifier_guesses', {count: areAnyClassifierGuesses})}
            </span>
                        <span>{t('image_classification.confidence')}</span>
                    </PointPopupSectionHeader>

                    <ClassifierGuesses
                        selectedPoint={selectedPoint}
                        dataToReview={dataToReview}
                        setDataToReview={setDataToReview}
                        setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
                    />
                </div>
            )}
            <SelectAttributeFromClassifierGuesses
                selectedPoint={selectedPoint}
                dataToReview={dataToReview}
                setDataToReview={setDataToReview}
                setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
                databaseSwitchboardInstance={databaseSwitchboardInstance}
            />

            <PopupBottomRow>
                <PopupZoomButtonContainer>
                    <MuiTooltipDark title={t('map_tooling.reset_zoom')}>
                        <PopupIconButton type="button" onClick={resetZoom}>
                            <IconZoomOut/>
                        </PopupIconButton>
                    </MuiTooltipDark>
                    <MuiTooltipDark title={t('map_tooling.zoom_to_point')}>
                        <PopupIconButton type="button" onClick={zoomToSelectedPoint}>
                            <IconZoomIn/>
                        </PopupIconButton>
                    </MuiTooltipDark>
                </PopupZoomButtonContainer>

                <PopupConfirmButton
                    type="button"
                    onClick={() => confirmPoint(selectedPoint.id)}
                    disabled={isSelectedPointConfirmed || isSelectedPointUnclassified}
                >
                    {isSelectedPointConfirmed ? t('image_classification.annotation.confirmed') : t('image_classification.annotation.confirm')}
                </PopupConfirmButton>

                <PopupZoomButtonContainer>
                    <MuiTooltipDark title={t('image_classification.annotation.next_unconfirmed_point')}>
                        <PopupIconButton
                            type="button"
                            onClick={selectNextUnconfirmedPoint}
                            disabled={areAllPointsConfirmed}
                        >
                            <IconArrowRight/>
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
