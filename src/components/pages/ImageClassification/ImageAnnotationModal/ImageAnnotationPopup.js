import React from 'react'
import PropTypes from 'prop-types'
import { Tr, Th, Td } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { PopupSubTh, PopupTable } from './ImageAnnotationModal.styles'

const SectionHeader = ({ title }) => (
  <Tr>
    <PopupSubTh colSpan={3}>{title}</PopupSubTh>
  </Tr>
)

const ClassifierGuesses = ({ annotations, getBenthicAttributeLabel, getGrowthFormLabel }) => {
  return annotations.map((annotation) => (
    <Tr key={annotation.id}>
      <Td>{getBenthicAttributeLabel(annotation.benthic_attribute)}</Td>
      <Td>{getGrowthFormLabel(annotation.growth_form)}</Td>
      <Td>{annotation.score}</Td>
    </Tr>
  ))
}

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
        <SectionHeader title="Classifier Guesses" />
        <ClassifierGuesses
          annotations={JSON.parse(properties.annotations)}
          getBenthicAttributeLabel={getBenthicAttributeLabel}
          getGrowthFormLabel={getGrowthFormLabel}
        />
        <SectionHeader title="Add to existing row" />
        <Tr>
          <Td colSpan={3}>Dropdown Row Selector goes here</Td>
        </Tr>
        <SectionHeader title="New row" />
        <Tr>
          <Td colSpan={3}>
            <ButtonSecondary>Choose Attribute</ButtonSecondary>
          </Td>
        </Tr>
      </tbody>
    </PopupTable>
  )
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

ClassifierGuesses.propTypes = {
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      benthic_attribute: PropTypes.string.isRequired,
      growth_form: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    }),
  ).isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
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
