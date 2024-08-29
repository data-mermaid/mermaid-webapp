import React from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { PopupSubTh, PopupTable } from './ImageAnnotationModal.styles'

const ImageAnnotationPopup = ({ properties, getBenthicAttributeLabel, getGrowthFormLabel }) => {
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
        {JSON.parse(properties.annotations).map((annotation) => (
          <Tr key={annotation.id}>
            <Td>{getBenthicAttributeLabel(annotation.benthic_attribute)}</Td>
            <Td>{getGrowthFormLabel(annotation.growth_form)}</Td>
            <Td>{annotation.score}</Td>
          </Tr>
        ))}
        <Tr>
          <PopupSubTh colSpan={3}>Add to existing row</PopupSubTh>
        </Tr>
        <Tr>
          <Td colSpan={3}>Dropdown Row Selector goes here</Td>
        </Tr>
        <Tr>
          <PopupSubTh colSpan={3}>New row</PopupSubTh>
        </Tr>
        <Tr>
          <Td colSpan={3}>
            <ButtonSecondary>Choose Attribute</ButtonSecondary>
          </Td>
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
    annotations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        benthic_attribute: PropTypes.string.isRequired,
        growth_form: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        is_confirmed: PropTypes.bool.isRequired,
        is_machine_created: PropTypes.bool.isRequired,
      }),
    ),
  }),
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ImageAnnotationPopup
