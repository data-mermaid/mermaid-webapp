import React from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Table } from '../../../../generic/Table/table'
import { imageClassificationResponsePropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { databaseSwitchboardPropTypes } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import ExistingRows from './ExistingRows'
import ClassifierGuesses from './ClassifierGuesses'
import NewRow from './NewRow'
import './ImageAnnotationPopup.css'

const ImageAnnotationPopup = ({
  dataToReview,
  setDataToReview,
  pointId,
  databaseSwitchboardInstance,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
}) => {
  const selectedPoint = dataToReview.points.find((point) => point.id === pointId)

  return (
    <Table aria-labelledby="table-label">
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
          getBenthicAttributeLabel={getBenthicAttributeLabel}
          getGrowthFormLabel={getGrowthFormLabel}
        />
        <ExistingRows
          selectedPoint={selectedPoint}
          dataToReview={dataToReview}
          setDataToReview={setDataToReview}
          getBenthicAttributeLabel={getBenthicAttributeLabel}
          getGrowthFormLabel={getGrowthFormLabel}
        />
        <NewRow
          selectedPoint={selectedPoint}
          dataToReview={dataToReview}
          setDataToReview={setDataToReview}
          databaseSwitchboardInstance={databaseSwitchboardInstance}
        />
      </tbody>
    </Table>
  )
}

ImageAnnotationPopup.propTypes = {
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  pointId: PropTypes.string.isRequired,
  databaseSwitchboardInstance: databaseSwitchboardPropTypes,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ImageAnnotationPopup
