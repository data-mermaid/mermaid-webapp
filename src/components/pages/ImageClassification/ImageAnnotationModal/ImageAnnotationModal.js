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
  Legend,
  LegendItem,
  LegendSquare,
  LoadingContainer,
} from './ImageAnnotationModal.styles'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'

const ImageAnnotationModal = ({ imageId, setImageId }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const [dataToReview, setDataToReview] = useState()
  const [growthForms, setGrowthForms] = useState()
  const [benthicAttributes, setBenthicAttributes] = useState()
  const [selectedPoints, setSelectedPoints] = useState([])
  const [highlightedPoints, setHighlightedPoints] = useState([])

  useEffect(() => {
    if (databaseSwitchboardInstance && projectId) {
      databaseSwitchboardInstance
        .getAnnotationsForImage(projectId, imageId)
        .then((data) => {
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

  const handleCloseModal = () => {
    // TODO: Save content before closing
    setImageId()
  }

  return (
    <Modal
      title={dataToReview?.original_image_name}
      isOpen
      onDismiss={handleCloseModal}
      allowCloseWithEscapeKey={false}
      maxWidth="100%"
      mainContent={
        dataToReview ? (
          <div>
            <ImageAnnotationModalTable
              points={dataToReview.points}
              growthForms={growthForms}
              benthicAttributes={benthicAttributes}
              setDataToReview={setDataToReview}
              setHighlightedPoints={setHighlightedPoints}
              setSelectedPoints={setSelectedPoints}
            />
            <ImageAnnotationModalMap
              dataToReview={dataToReview}
              setDataToReview={setDataToReview}
              highlightedPoints={highlightedPoints}
              selectedPoints={selectedPoints}
            />
          </div>
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
          <button onClick={handleCloseModal}>Close</button>
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
