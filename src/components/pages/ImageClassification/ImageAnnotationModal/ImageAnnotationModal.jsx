import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../../../generic/Modal/Modal'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import ImageAnnotationModalTable from './ImageAnnotationModalTable'
import ImageAnnotationModalMap from './ImageAnnotationModalMap'
import {
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
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import { useImageScale } from '../useImageScale'
import { useZoomToPointsByAttributeId } from './useZoomToPointsByAttributeId'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { DEFAULT_MAP_ANIMATION_DURATION } from '../imageClassificationConstants'

const EXCLUDE_PARAMS =
  'classification_status,collect_record_id,comments,created_by,created_on,data,id,location,name,num_confirmed,num_unclassified,num_unconfirmed,photo_timestamp,thumbnail,updated_by,updated_on'

// Context: Strategy for the Image Annotation Modal is to use the 1st annotation in the array for each point
// as the "current" annotation. The 1st annotation is used to group points into rows for the table,
// and also used as the properties for the points on the map.
// Annotations that are "confirmed" get top priority, with the other annotations being sorted by score from the API.
// When a user selects a new annotation for that point, it is pushed to the first position in the annotations array.

const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

const ImageAnnotationModal = ({
  imageId,
  setImageId,
  benthicAttributes,
  growthForms,
  onAnnotationSaveSuccess,
}) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const [dataToReview, setDataToReview] = useState()
  const [selectedAttributeId, setSelectedAttributeId] = useState('')
  const [hoveredAttributeId, setHoveredAttributeId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDataUpdatedSinceLastSave, setIsDataUpdatedSinceLastSave] = useState(false)
  const [hasMapLoaded, setHasMapLoaded] = useState(false)
  const [isTableShowing, setIsTableShowing] = useState(true)
  const map = useRef(null)
  const [patchesGeoJson, setPatchesGeoJson] = useState()

  const { imageScale } = useImageScale({ hasMapLoaded, dataToReview })
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const zoomToPaddedBounds = useCallback(
    (bounds) => {
      if (!bounds || !map.current) {
        return
      }

      map.current.fitBounds(bounds, {
        padding: 250,
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
      return matchingBenthicAttribute?.name ?? ''
    },
    [benthicAttributes],
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

  const _fetchImageAnnotations = useEffect(() => {
    if (databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getAnnotationsForImage(projectId, imageId, EXCLUDE_PARAMS)
        .then((data) => {
          const formattedPoints = data.points.map((point) => {
            const sortedAnnotations = point.annotations.toSorted(prioritizeConfirmedAnnotations)
            // eslint-disable-next-line max-nested-callbacks
            const formattedAnnotations = sortedAnnotations.map((annotation) => ({
              ...annotation,
              ba_gr: annotation.benthic_attribute + '_' + annotation.growth_form,
              ba_gr_label: getAttributeGrowthFormLabel(annotation),
            }))

            return { ...point, annotations: formattedAnnotations }
          })

          setDataToReview({ ...data, points: formattedPoints })
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(
                ...getToastArguments(`Failed to fetch image annotations. ${error.message}`),
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
  ])

  const handleCloseModal = () => {
    if (
      !isDataUpdatedSinceLastSave ||
      window.confirm('Are you sure you want to discard the change to this image?')
    ) {
      setImageId()
    }
  }

  const handleSaveChanges = () => {
    setIsSaving(true)

    databaseSwitchboardInstance
      .saveAnnotationsForImage(projectId, imageId, dataToReview.points)
      .then(() => {
        setImageId()
        onAnnotationSaveSuccess()
        toast.success('Successfully saved image annotations')
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(`Failed to save image annotations. ${error.message}`))
          },
          shouldShowServerNonResponseMessage: false,
        })
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <>
      <EnhancedPrompt shouldPromptTrigger={isDataUpdatedSinceLastSave} />
      <Modal
        title={dataToReview?.original_image_name ?? ''}
        isOpen
        onDismiss={handleCloseModal}
        contentOverflowIsVisible={true}
        maxWidth="fit-content"
        mainContent={
          dataToReview && !isSaving && imageScale ? (
            <ImageAnnotationModalContainer>
              <ImageAnnotationModalTable
                points={dataToReview.points}
                setDataToReview={setDataToReview}
                selectedAttributeId={selectedAttributeId}
                setSelectedAttributeId={setSelectedAttributeId}
                setHoveredAttributeId={setHoveredAttributeId}
                setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
                zoomToPointsByAttributeId={zoomToPointsByAttributeId}
                isTableShowing={isTableShowing}
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
                setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
                setIsTableShowing={setIsTableShowing}
                setPatchesGeoJson={setPatchesGeoJson}
                zoomToPaddedBounds={zoomToPaddedBounds}
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
                <LegendSquare color={COLORS.confirmed} />
                Confirmed
              </LegendItem>
              <LegendItem>
                <LegendSquare color={COLORS.unconfirmed} />
                Unconfirmed
              </LegendItem>
              <LegendItem>
                <LegendSquare color={COLORS.unclassified} />
                Unclassified
              </LegendItem>
            </Legend>
            <div>
              <ButtonSecondary type="button" onClick={handleCloseModal} disabled={isSaving}>
                Cancel
              </ButtonSecondary>
              <ButtonPrimary type="button" onClick={handleSaveChanges} disabled={isSaving}>
                Save Changes
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
  benthicAttributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  growthForms: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAnnotationSaveSuccess: PropTypes.func.isRequired,
}

export default ImageAnnotationModal
