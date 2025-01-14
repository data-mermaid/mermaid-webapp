import React from 'react'
import PropTypes from 'prop-types'
import { Tr, Th } from '../../../../generic/Table/table'
import { imageClassificationResponsePropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { databaseSwitchboardPropTypes } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SelectAttributeFromClassifierGuesses from './SelectAttributeFromClassifierGuesses'
import ClassifierGuesses from './ClassifierGuesses'
import { EditPointPopupTable } from '../ImageAnnotationModal.styles'
import './ImageAnnotationPopup.css'

const ImageAnnotationPopup = ({
  dataToReview,
  setDataToReview,
  pointId,
  databaseSwitchboardInstance,
  setIsDataUpdatedSinceLastSave,
}) => {
  const selectedPoint = dataToReview.points.find((point) => point.id === pointId)

  return (
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
  )
}

ImageAnnotationPopup.propTypes = {
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  pointId: PropTypes.string.isRequired,
  databaseSwitchboardInstance: databaseSwitchboardPropTypes,
  setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
}

export default ImageAnnotationPopup
