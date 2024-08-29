import React from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { PopupSubTh, PopupTable } from './ImageAnnotationModal.styles'

const ImageAnnotationPopup = ({ properties }) => {
  return (
    <PopupTable aria-labelledby="table-label">
      <thead>
        <Tr>
          <Th>Benthic Attribute</Th>
          <Th>Growth Form</Th>
          <Th>Confidence</Th>
        </Tr>
      </thead>
      <tbody>
        <Tr>
          <PopupSubTh colSpan={3}>Classifier Guesses</PopupSubTh>
        </Tr>
        <Tr>
          <Td>{properties.benthicAttributeId}</Td>
          <Td>{properties.growthFormId}</Td>
          <Td>0.5</Td>
        </Tr>
        <Tr>
          <Td>{properties.benthicAttributeId}</Td>
          <Td>{properties.growthFormId}</Td>
          <Td>0.5</Td>
        </Tr>
        <Tr>
          <Td>{properties.benthicAttributeId}</Td>
          <Td>{properties.growthFormId}</Td>
          <Td>0.5</Td>
        </Tr>
        <Tr>
          <PopupSubTh colSpan={3}>Add to existing row</PopupSubTh>
        </Tr>
        <Tr>
          <Td>{properties.benthicAttributeId}</Td>
          <Td>{properties.growthFormId}</Td>
          <Td>0.5</Td>
        </Tr>
        <Tr>
          <PopupSubTh colSpan={3}>New row</PopupSubTh>
        </Tr>
        <Tr colSpan={3}>
          <ButtonSecondary>Choose Attribute</ButtonSecondary>
        </Tr>
      </tbody>
    </PopupTable>
  )
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
