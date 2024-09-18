import React, { useEffect, useState } from 'react'
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

// Context: Strategy for the Image Annotation Modal is to use the 1st annotation in the array for each point
// as the "current" annotation. The 1st annotation is used to group points into rows for the table,
// and also used as the properties for the points on the map.
// Annotations that are "confirmed" get top priority, with the other annotations being sorted by score from the API.
// When a user selects a new annotation for that point, it is pushed to the first position in the annotations array.

const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

const ImageAnnotationModal = ({ imageId, setImageId }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const [dataToReview, setDataToReview] = useState()
  const [growthForms, setGrowthForms] = useState()
  const [benthicAttributes, setBenthicAttributes] = useState()
  const [highlightedAttributeId, setHighlightedAttributeId] = useState('')

  const _fetchImageAnnotations = useEffect(() => {
    if (databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getAnnotationsForImage(projectId, imageId)
        .then((data) => {
          data.points.map((point) => point.annotations.sort(prioritizeConfirmedAnnotations))
          setDataToReview(data)
        })
        .catch(() => {
          toast.error('Failed to fetch image annotations')
        })

      // TODO: These two will likely be fetched in ObservationTable and passed to this component as props
      // Because of that, not going to add error handling / loading indicators / Promise.all
      databaseSwitchboardInstance.getChoices().then(({ growthforms }) => {
        setGrowthForms(growthforms.data)
      })

      databaseSwitchboardInstance.getBenthicAttributes().then((benthicAttributes) => {
        setBenthicAttributes(benthicAttributes)
      })
    }
    // eslint-disable-next-line
  }, [])

  const handleCloseModal = () => setImageId()

  const handleSaveChanges = () => {
    databaseSwitchboardInstance
      .saveAnnotationsForImage(projectId, imageId, dataToReview.points)
      .then(() => {
        setImageId()
        toast.success('Successfully saved image annotations')
      })
      .catch(() => {
        toast.error('Failed to save image annotations')
      })
  }

  const getBenthicAttributeLabel = (benthicAttributeId) => {
    const matchingBenthicAttribute = benthicAttributes.find(({ id }) => id === benthicAttributeId)
    return matchingBenthicAttribute?.name ?? ''
  }

  const getGrowthFormLabel = (growthFormId) => {
    const matchingGrowthForm = growthForms.find(({ id }) => id === growthFormId)
    return matchingGrowthForm?.name ?? ''
  }

  return (
    <Modal
      title={dataToReview?.original_image_name ?? ''}
      isOpen
      onDismiss={handleCloseModal}
      allowCloseWithEscapeKey={false}
      maxWidth="fit-content"
      contentOverflowIsVisible
      mainContent={
        dataToReview ? (
          <ImageAnnotationModalContainer>
            <ImageAnnotationModalTable
              points={dataToReview.points}
              setDataToReview={setDataToReview}
              getBenthicAttributeLabel={getBenthicAttributeLabel}
              getGrowthFormLabel={getGrowthFormLabel}
              setHighlightedAttributeId={setHighlightedAttributeId}
            />
            <ImageAnnotationModalMap
              dataToReview={dataToReview}
              setDataToReview={setDataToReview}
              highlightedAttributeId={highlightedAttributeId}
              databaseSwitchboardInstance={databaseSwitchboardInstance}
              getBenthicAttributeLabel={getBenthicAttributeLabel}
              getGrowthFormLabel={getGrowthFormLabel}
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
              <LegendSquare color={COLORS.current} />
              Current
            </LegendItem>
            <LegendItem>
              <LegendSquare color={COLORS.unconfirmed} />
              Unconfirmed
            </LegendItem>
            <LegendItem>
              <LegendSquare color={COLORS.confirmed} />
              Confirmed
            </LegendItem>
            <LegendItem>
              <LegendSquare color={COLORS.unclassified} />
              Unclassified
            </LegendItem>
          </Legend>
          <div>
            <ButtonSecondary onClick={handleCloseModal}>Cancel</ButtonSecondary>
            <ButtonPrimary onClick={handleSaveChanges}>Save Changes</ButtonPrimary>
          </div>
        </Footer>
      }
    />
  )
}

ImageAnnotationModal.propTypes = {
  imageId: PropTypes.string.isRequired,
  setImageId: PropTypes.func.isRequired,
}

export default ImageAnnotationModal
