import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../../../generic/Modal/Modal'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import ImageAnnotationModalTable from './ImageAnnotationModalTable'
import ImageAnnotationModalMap from './ImageAnnotationModalMap'
import { Footer, Legend, LegendItem, LegendSquare } from './ImageAnnotationModal.styles'

const ImageAnnotationModal = ({ dataToReview, setDataToReview }) => {
  const handleCloseModal = () => {
    // TODO: Save content before closing
    setDataToReview()
  }

  return (
    <Modal
      title={dataToReview.original_image_name}
      isOpen
      onDismiss={handleCloseModal}
      allowCloseWithEscapeKey={false}
      maxWidth="100%"
      mainContent={
        <div>
          <ImageAnnotationModalTable dataToReview={dataToReview} />
          <ImageAnnotationModalMap dataToReview={dataToReview} setDataToReview={setDataToReview} />
        </div>
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
  setDataToReview: PropTypes.func.isRequired,
  dataToReview: PropTypes.shape({
    original_image_name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(
      PropTypes.shape({
        row: PropTypes.number.isRequired,
        column: PropTypes.number.isRequired,
        annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
      }),
    ),
  }),
}

export default ImageAnnotationModal
