import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tr, Th } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { imageClassificationResponsePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  PopupSubTh,
  PopupTable,
  PopupTd,
  PopupInputAutocompleteContainer,
} from './ImageAnnotationModal.styles'
import { Select } from '../../../generic/form'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import { getBenthicOptions } from '../../../../library/getOptions'
import language from '../../../../language'
import { databaseSwitchboardPropTypes } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'

const SectionHeader = ({ title }) => (
  <Tr>
    <PopupSubTh colSpan={3}>{title}</PopupSubTh>
  </Tr>
)

const ClassifierGuesses = ({ annotations, getBenthicAttributeLabel, getGrowthFormLabel }) => {
  return annotations.map((annotation) => (
    <Tr key={annotation.id}>
      <PopupTd>{getBenthicAttributeLabel(annotation.benthic_attribute)}</PopupTd>
      <PopupTd>{getGrowthFormLabel(annotation.growth_form)}</PopupTd>
      <PopupTd>{annotation.score}</PopupTd>
    </Tr>
  ))
}

const isClassified = ({ is_unclassified, annotations }) =>
  !is_unclassified && annotations.length > 0

const ImageAnnotationPopup = ({
  dataToReview,
  pointId,
  databaseSwitchboardInstance,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
}) => {
  const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])
  const [growthFormSelectOptions, setGrowthFormSelectOptions] = useState([])
  const [selectedNewRowValues, setSelectedNewRowValues] = useState({
    benthicAttr: '',
    growthForm: '',
  })

  const point = dataToReview.points.find((point) => point.id === pointId)

  const existingRowDropdownOptions = dataToReview.points.reduce((acc, currentPoint) => {
    const { benthic_attribute, growth_form } = currentPoint.annotations[0]
    const value = benthic_attribute + '_' + growth_form
    const label = `${getBenthicAttributeLabel(benthic_attribute)} ${getGrowthFormLabel(
      growth_form,
    )}`

    if (isClassified(currentPoint) && !acc.some((option) => option.value === value)) {
      acc.push({ label: label, value: value })
    }

    return acc
  }, [])

  const [selectedExistingRow, setSelectedExistingRow] = useState(() => {
    const rowKeyForPoint =
      point.annotations[0].benthic_attribute + '_' + point.annotations[0].growth_form
    const isPointInARow = existingRowDropdownOptions.some((row) => rowKeyForPoint === row.value)
    return isPointInARow ? rowKeyForPoint : ''
  })

  const handleDisplayNewRowSelection = () => {
    const promises = [
      databaseSwitchboardInstance.getBenthicAttributes(),
      databaseSwitchboardInstance.getChoices(),
    ]

    Promise.all(promises).then(([benthicAttributes, choices]) => {
      setBenthicAttributeSelectOptions(getBenthicOptions(benthicAttributes))
      setGrowthFormSelectOptions(choices.growthforms.data)
    })
  }

  const handleBenthicAttributeSelection = ({ value }) => {
    setSelectedNewRowValues({ ...selectedNewRowValues, benthicAttr: value })
  }

  const handleGrowthFormSelection = (growthFormId) => {
    setSelectedNewRowValues({ ...selectedNewRowValues, growthForm: growthFormId })
  }

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
          annotations={point.annotations}
          getBenthicAttributeLabel={getBenthicAttributeLabel}
          getGrowthFormLabel={getGrowthFormLabel}
        />
        <SectionHeader title="Add to existing row" />
        <Tr>
          <PopupTd colSpan={3}>
            <Select
              label="Add to existing row"
              value={selectedExistingRow}
              onChange={(e) => setSelectedExistingRow(e.target.value)}
            >
              {existingRowDropdownOptions.map((row) => (
                <option key={row.value} value={row.value}>
                  {row.label}
                </option>
              ))}
            </Select>
          </PopupTd>
        </Tr>
        <SectionHeader title="New row" />
        <Tr>
          {benthicAttributeSelectOptions.length ? (
            <>
              <PopupTd>
                <PopupInputAutocompleteContainer>
                  <ObservationAutocomplete
                    id="benthic-attribute-autocomplete"
                    autoFocus
                    aria-labelledby="benthic-attribute-label"
                    options={benthicAttributeSelectOptions}
                    onChange={handleBenthicAttributeSelection}
                    noResultsText={language.autocomplete.noResultsDefault}
                  />
                </PopupInputAutocompleteContainer>
              </PopupTd>
              <PopupTd>
                <Select
                  label="Growth forms"
                  onChange={(e) => handleGrowthFormSelection(e.target.value)}
                >
                  {growthFormSelectOptions.map((growthForm) => (
                    <option key={growthForm.id} value={growthForm.id}>
                      {growthForm.name}
                    </option>
                  ))}
                </Select>
              </PopupTd>
              <PopupTd />
            </>
          ) : (
            <PopupTd colSpan={3}>
              <ButtonSecondary onClick={handleDisplayNewRowSelection}>
                Choose Attribute
              </ButtonSecondary>
            </PopupTd>
          )}
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
  dataToReview: imageClassificationResponsePropType.isRequired,
  pointId: PropTypes.string.isRequired,
  databaseSwitchboardInstance: databaseSwitchboardPropTypes,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ImageAnnotationPopup