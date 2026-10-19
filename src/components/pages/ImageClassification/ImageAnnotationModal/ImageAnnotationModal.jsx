import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import theme from '../../../../theme'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import Modal from '../../../generic/Modal'
import {
  IMAGE_CLASSIFICATION_COLORS as COLORS,
  unclassifiedGuid,
} from '../../../../library/constants/constants'
import ImageAnnotationModalTable from './ImageAnnotationModalTable'
import ImageAnnotationModalMap from './ImageAnnotationModalMap'
import {
  ButtonWithTrailingIcon,
  Footer,
  ImageAnnotationModalContainer,
  Legend,
  LegendItem,
  LegendSquare,
  LoadingContainer,
} from './ImageAnnotationModal.styles'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import { ButtonPrimary, ButtonSecondary } from '../../../generic/buttons'
import { IconArrowLeft, IconArrowRight } from '../../../icons'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import { useImageScale } from '../useImageScale'
import { useZoomToPointsByAttributeId } from './useZoomToPointsByAttributeId'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { DEFAULT_MAP_ANIMATION_DURATION } from '../imageClassificationConstants'
import { useAnnotationSaveQueue } from './useAnnotationSaveQueue'
import { useTranslation } from 'react-i18next'

const EXCLUDE_PARAMS =
  'classification_status,collect_record_id,comments,created_by,created_on,data,id,location,name,num_confirmed,num_unclassified,num_unconfirmed,photo_timestamp,thumbnail,updated_by,updated_on'

// Context: Strategy for the Image Annotation Modal is to use the 1st annotation in the array for each point
// as the "current" annotation. The 1st annotation is used to group points into rows for the table,
// and also used as the properties for the points on the map.
// Annotations that are "confirmed" get top priority, with the other annotations being sorted by score from the API.
// When a user selects a new annotation for that point, it is pushed to the first position in the annotations array.

const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

// Image annotations that are unclassified have additional values added that need to be stripped before saving
const removeMappedUnclassifiedPointData = (points) => {
  return points.map((point) => {
    if (point.annotations[0].ba_gr === unclassifiedGuid) {
      return { ...point, annotations: [] }
    } else {
      return point
    }
  })
}

const ImageAnnotationModal = ({
  imageId,
  setImageId,
  previousImageId,
  nextImageId,
  benthicAttributes,
  growthForms,
  onAnnotationSaveSuccess,
}) => {
  const { t } = useTranslation()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const popupRef = useRef(null)
  const hasFetchedAnnotations = useRef(false)

  const [dataToReview, setDataToReview] = useState()
  const [selectedAttributeId, setSelectedAttributeId] = useState('')
  const [hoveredAttributeId, setHoveredAttributeId] = useState('')
  const [hasMapLoaded, setHasMapLoaded] = useState(false)
  const [isTableShowing, setIsTableShowing] = useState(true)
  const map = useRef(null)
  const [patchesGeoJson, setPatchesGeoJson] = useState()
  const [selectedPoint, setSelectedPoint] = useState({
    id: null,
    popupAnchorLngLat: null,
    popupAnchorPosition: null,
    bounds: null,
  })

  const { imageScale } = useImageScale({ hasMapLoaded, dataToReview })
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const { markPointsChanged, flush, hasUnsavedChanges, isSaving } = useAnnotationSaveQueue({
    points: dataToReview?.points,
    savePoints: (points) =>
      databaseSwitchboardInstance
        .saveAnnotationsForImage(projectId, imageId, removeMappedUnclassifiedPointData(points))
        .then(onAnnotationSaveSuccess),
    onSaveFailed: (error) =>
      handleHttpResponseError({
        error,
        callback: () => {
          toast.error(
            ...getToastArguments(t('image_classification.errors.save_failed_changes_kept')),
          )
        },
        shouldShowServerNonResponseMessage: false,
        // Going offline unmounts this window and discards the unsaved annotations
        shouldSetServerNotReachable: false,
      }),
  })

  const zoomToPaddedBounds = useCallback(
    (bounds, isPointLabelPopupOpen = false) => {
      if (!bounds || !map.current) {
        return
      }

      map.current.fitBounds(bounds, {
        padding: isPointLabelPopupOpen ? 200 : 50,
        duration: DEFAULT_MAP_ANIMATION_DURATION,
        linear: true,
      })
    },
    [map],
  )

  const { zoomToPointsByAttributeId } = useZoomToPointsByAttributeId({
    zoomToPaddedBounds,
    patchesGeoJson,
  })

  const getBenthicAttributeLabel = useCallback(
    (benthicAttributeId) => {
      const matchingBenthicAttribute = benthicAttributes.find(({ id }) => id === benthicAttributeId)
      return matchingBenthicAttribute?.name ?? t('image_classification.annotation.unclassified')
    },
    [benthicAttributes, t],
  )

  const getGrowthFormLabel = useCallback(
    (growthFormId) => {
      const matchingGrowthForm = growthForms.find(({ id }) => id === growthFormId)
      return matchingGrowthForm?.name.toLowerCase() ?? ''
    },
    [growthForms],
  )

  const getAttributeGrowthFormLabel = useCallback(
    ({ benthic_attribute, growth_form }) =>
      growth_form
        ? `${getBenthicAttributeLabel(benthic_attribute)} ${getGrowthFormLabel(growth_form)}`
        : getBenthicAttributeLabel(benthic_attribute),
    [getBenthicAttributeLabel, getGrowthFormLabel],
  )

  // Fetches once per window. A later run, from a dependency changing identity, would replace
  // dataToReview and discard changes the save queue hasn't saved yet.
  const _fetchImageAnnotations = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !hasFetchedAnnotations.current) {
      hasFetchedAnnotations.current = true
      databaseSwitchboardInstance
        .getAnnotationsForImage(projectId, imageId, EXCLUDE_PARAMS)
        .then((data) => {
          const formattedPoints = data.points.map((point) => {
            if (point.annotations.length === 0) {
              point.annotations.push({
                ba_gr: unclassifiedGuid,
                ba_gr_label: t('image_classification.annotation.unclassified'),
              })
            }
            const sortedAnnotations = point.annotations?.toSorted(prioritizeConfirmedAnnotations)

            // eslint-disable-next-line max-nested-callbacks
            const labeledAnnotations = sortedAnnotations.map((annotation) => {
              const ba = annotation.benthic_attribute ?? unclassifiedGuid
              const ba_gr = annotation.growth_form ? `${ba}_${annotation.growth_form}` : ba

              return {
                ...annotation,
                ba_gr: ba_gr,
                ba_gr_label: getAttributeGrowthFormLabel(annotation),
              }
            })

            return { ...point, annotations: labeledAnnotations }
          })
          setDataToReview({ ...data, points: formattedPoints })
        })
        .catch((error) => {
          hasFetchedAnnotations.current = false
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(
                ...getToastArguments(
                  `${t('image_classification.errors.failed_annotations_fetch')} ${error.message}`,
                ),
              )
            },
            shouldShowServerNonResponseMessage: false,
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    getAttributeGrowthFormLabel,
    handleHttpResponseError,
    imageId,
    projectId,
    t,
  ])

  const closePopup = () => {
    setSelectedPoint({
      id: null,
      popupAnchorLngLat: null,
      popupAnchorPosition: null,
      bounds: null,
    })
    popupRef.current?.remove()
  }

  // Saves anything pending first, so closing only asks to discard changes that failed to save
  const handleCloseModal = async () => {
    if (
      (await flush()) ||
      window.confirm(t('image_classification.user_message.confirm_image_changes'))
    ) {
      setImageId()
    }
  }

  // Stays on this photo if its changes can't be saved, so none are left behind
  const handleShowImage = async (targetImageId) => {
    if (await flush()) {
      setImageId(targetImageId)
    }
  }

  // The save queue reports a failure itself, so only success needs handling here
  const handleSaveChanges = async () => {
    if (await flush()) {
      toast.success(t('image_classification.success.annotations_saved'))
    }
  }

  // Changes save as they're made, so Save is only needed once a save has failed
  const getSaveButtonText = () => {
    if (isSaving) {
      return t('buttons.saving')
    }

    return hasUnsavedChanges ? t('buttons.save_changes') : t('buttons.saved')
  }

  return (
    <>
      <EnhancedPrompt shouldPromptTrigger={hasUnsavedChanges} />
      <Modal
        title={dataToReview?.original_image_name ?? ''}
        isOpen
        onDismiss={handleCloseModal}
        maxWidth="fit-content"
        mainContent={
          dataToReview && imageScale ? (
            <ImageAnnotationModalContainer>
              <ImageAnnotationModalTable
                points={dataToReview.points}
                setDataToReview={setDataToReview}
                selectedAttributeId={selectedAttributeId}
                setSelectedAttributeId={setSelectedAttributeId}
                setHoveredAttributeId={setHoveredAttributeId}
                onPointsChanged={markPointsChanged}
                zoomToPointsByAttributeId={zoomToPointsByAttributeId}
                isTableShowing={isTableShowing}
                closePopup={closePopup}
              />
              <ImageAnnotationModalMap
                databaseSwitchboardInstance={databaseSwitchboardInstance}
                dataToReview={dataToReview}
                hasMapLoaded={hasMapLoaded}
                hoveredAttributeId={hoveredAttributeId}
                imageScale={imageScale}
                isTableShowing={isTableShowing}
                map={map}
                patchesGeoJson={patchesGeoJson}
                selectedAttributeId={selectedAttributeId}
                setDataToReview={setDataToReview}
                setHasMapLoaded={setHasMapLoaded}
                onPointsChanged={markPointsChanged}
                setIsTableShowing={setIsTableShowing}
                setPatchesGeoJson={setPatchesGeoJson}
                zoomToPaddedBounds={zoomToPaddedBounds}
                selectedPoint={selectedPoint}
                setSelectedPoint={setSelectedPoint}
                popupRef={popupRef}
                closePopup={closePopup}
              />
            </ImageAnnotationModalContainer>
          ) : (
            <LoadingContainer>
              <LoadingIndicator />
            </LoadingContainer>
          )
        }
        footerContent={
          <Footer>
            <Legend>
              <LegendItem>
                <LegendSquare $color={COLORS.confirmed} />
                {t('image_classification.annotation.confirmed')}
              </LegendItem>
              <LegendItem>
                <LegendSquare style={{ border: `3px dotted ${theme.color.brandSecondary}` }} />
                {t('image_classification.annotation.unconfirmed')}
              </LegendItem>
              <LegendItem>
                <LegendSquare style={{ border: `3px dotted ${COLORS.unclassified}` }} />
                {t('image_classification.annotation.unclassified')}
              </LegendItem>
            </Legend>
            <div>
              <ButtonSecondary
                type="button"
                onClick={() => handleShowImage(previousImageId)}
                disabled={!previousImageId}
              >
                <IconArrowLeft />
                {t('image_classification.buttons.previous_photo')}
              </ButtonSecondary>
              <ButtonWithTrailingIcon
                type="button"
                onClick={() => handleShowImage(nextImageId)}
                disabled={!nextImageId}
              >
                {t('image_classification.buttons.next_photo')}
                <IconArrowRight />
              </ButtonWithTrailingIcon>
              <ButtonSecondary type="button" onClick={handleCloseModal}>
                {t('buttons.close')}
              </ButtonSecondary>
              <ButtonPrimary
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving || !hasUnsavedChanges}
              >
                {getSaveButtonText()}
              </ButtonPrimary>
            </div>
          </Footer>
        }
      />
    </>
  )
}

ImageAnnotationModal.propTypes = {
  imageId: PropTypes.string.isRequired,
  setImageId: PropTypes.func.isRequired,
  previousImageId: PropTypes.string,
  nextImageId: PropTypes.string,
  benthicAttributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  growthForms: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAnnotationSaveSuccess: PropTypes.func.isRequired,
}

export default ImageAnnotationModal
