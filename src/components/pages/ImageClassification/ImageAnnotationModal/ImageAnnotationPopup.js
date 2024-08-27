import React from 'react'
import PropTypes from 'prop-types'

const ImageAnnotationPopup = ({ properties }) => {
  return <div>{properties.benthicAttributeId}</div>
}

ImageAnnotationPopup.propTypes = {
  properties: PropTypes.shape({
    id: PropTypes.string.isRequired,
    benthicAttributeId: PropTypes.string.isRequired,
    growthFormId: PropTypes.string.isRequired,
    isUnclassified: PropTypes.bool.isRequired,
    isConfirmed: PropTypes.bool.isRequired,
  }),
}

export default ImageAnnotationPopup
