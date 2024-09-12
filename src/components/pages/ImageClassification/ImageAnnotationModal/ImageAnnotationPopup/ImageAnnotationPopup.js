import React from 'react'
import PropTypes from 'prop-types'
import { Tr, Th } from '../../../../generic/Table/table'
import { imageClassificationResponsePropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { PopupSubTh, PopupTable } from '../ImageAnnotationModal.styles'
import { databaseSwitchboardPropTypes } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import ExistingRows from './ExistingRows'
import ClassifierGuesses from './ClassifierGuesses'
import NewRow from './NewRow'

const SectionHeader = ({ title }) => (
  <Tr>
    <PopupSubTh colSpan={4}>{title}</PopupSubTh>
  </Tr>
)

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
    <PopupTable aria-labelledby="table-label">
      <thead>
        <Tr>
          <Th colSpan={2}>Benthic Attribute</Th>
          <Th>Growth Form</Th>
          <Th>Confidence</Th>
        </Tr>
      </thead>
      <tbody>
        <SectionHeader title="Classifier Guesses" />
        <ClassifierGuesses
          selectedPoint={selectedPoint}
          dataToReview={dataToReview}
          setDataToReview={setDataToReview}
          getBenthicAttributeLabel={getBenthicAttributeLabel}
          getGrowthFormLabel={getGrowthFormLabel}
        />
        <SectionHeader title="Add to existing row" />
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
    </PopupTable>
  )
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
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
