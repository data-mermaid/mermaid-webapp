import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { Tr, Th } from '../../../generic/Table/table'
import { ButtonSecondary } from '../../../generic/buttons'
import { imageClassificationResponsePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  PopupSubTh,
  PopupTable,
  PopupTd,
  PopupInputAutocompleteContainer,
  PopupTdForRadio,
} from './ImageAnnotationModal.styles'
import { Select } from '../../../generic/form'
import ObservationAutocomplete from '../../../ObservationAutocomplete/ObservationAutocomplete'
import { getBenthicOptions } from '../../../../library/getOptions'
import language from '../../../../language'
import { databaseSwitchboardPropTypes } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'

const SectionHeader = ({ title }) => (
  <Tr>
    <PopupSubTh colSpan={4}>{title}</PopupSubTh>
  </Tr>
)

const ClassifierGuesses = ({
  annotations,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
  selectedRadioOption,
  handleRadioSelection,
}) => {
  const annotationsSortedByScore = annotations.toSorted((a, b) => b.score - a.score)

  return annotationsSortedByScore.map((annotation, i) => (
    <Tr key={annotation.id}>
      <PopupTdForRadio>
        <input
          type="radio"
          id={`${annotation.benthic_attribute}_${annotation.growth_form}`}
          name={`${annotation.benthic_attribute}_${annotation.growth_form}`}
          value={`classifier-guess-${i}`}
          checked={selectedRadioOption === `classifier-guess-${i}`}
          onChange={() => handleRadioSelection(`classifier-guess-${i}`)}
        />
      </PopupTdForRadio>
      <PopupTd>{getBenthicAttributeLabel(annotation.benthic_attribute)}</PopupTd>
      <PopupTd>{getGrowthFormLabel(annotation.growth_form)}</PopupTd>
      <PopupTd>{annotation.score}</PopupTd>
    </Tr>
  ))
}

const isClassified = ({ is_unclassified, annotations }) =>
  !is_unclassified && annotations.length > 0

const moveItemToFront = (array, index) => {
  const newArray = [...array]
  newArray.unshift(newArray.splice(index, 1)[0])
  return newArray
}

const ImageAnnotationPopup = ({
  dataToReview,
  setDataToReview,
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
  const [selectedRadioOption, setSelectedRadioOption] = useState('')

  const selectedPoint = dataToReview.points.find((point) => point.id === pointId)

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
      selectedPoint.annotations[0].benthic_attribute +
      '_' +
      selectedPoint.annotations[0].growth_form
    const isPointInARow = existingRowDropdownOptions.some((row) => rowKeyForPoint === row.value)
    return isPointInARow ? rowKeyForPoint : ''
  })

  const handleDisplayNewRowSelection = () => {
    const promises = [
      databaseSwitchboardInstance.getBenthicAttributes(),
      databaseSwitchboardInstance.getChoices(),
    ]

    Promise.all(promises)
      .then(([benthicAttributes, choices]) => {
        setBenthicAttributeSelectOptions(getBenthicOptions(benthicAttributes))
        setGrowthFormSelectOptions(choices.growthforms.data)
      })
      .catch(() => {
        toast.error('Failed to retrieve benthic attributes and growth forms')
      })
  }

  const handleBenthicAttributeSelection = ({ benthicAttrId }) => {
    setSelectedNewRowValues({ ...selectedNewRowValues, benthicAttr: benthicAttrId })
    setSelectedRadioOption('new-row')
    updateAnnotationsForPoint('new-row')
  }

  const handleGrowthFormSelection = (growthFormId) => {
    setSelectedNewRowValues({ ...selectedNewRowValues, growthForm: growthFormId })
    if (selectedNewRowValues.benthicAttr) {
      setSelectedRadioOption('new-row')
      updateAnnotationsForPoint('new-row')
    }
  }

  const updateAnnotationsForPoint = (value) => {
    let updatedAnnotations

    if (value.includes('classifier-guess')) {
      const classifierGuessIndex = value.charAt(value.length - 1)
      updatedAnnotations = moveItemToFront(selectedPoint.annotations, classifierGuessIndex)
    } else if (value === 'existing-row') {
      const [benthic_attribute, growth_form] = selectedExistingRow.split('_')
      updatedAnnotations = [
        {
          benthic_attribute,
          growth_form: growth_form === 'null' ? null : growth_form,
          is_confirmed: true,
        },
        ...selectedPoint.annotations,
      ]
    } else if (value === 'new-row') {
      updatedAnnotations = [
        {
          benthic_attribute: selectedNewRowValues.benthicAttr,
          growth_form: selectedNewRowValues.growthForm || null,
          is_confirmed: true,
        },
        ...selectedPoint.annotations,
      ]
    }

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )
    setDataToReview({ ...dataToReview, points: updatedPoints })
  }

  const handleRadioSelection = (value) => {
    if (
      value.includes('classifier-guess') ||
      value === 'existing-row' ||
      (value === 'new-row' && selectedNewRowValues.benthicAttr)
    ) {
      updateAnnotationsForPoint(value)
    }

    setSelectedRadioOption(value)
  }

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
          annotations={selectedPoint.annotations}
          getBenthicAttributeLabel={getBenthicAttributeLabel}
          getGrowthFormLabel={getGrowthFormLabel}
          selectedRadioOption={selectedRadioOption}
          handleRadioSelection={handleRadioSelection}
        />
        <SectionHeader title="Add to existing row" />
        <Tr>
          <PopupTdForRadio>
            <input
              type="radio"
              id="existing-row-point-selection"
              name="existing-row-point-selection"
              value="existing-row"
              checked={selectedRadioOption === 'existing-row'}
              onChange={() => handleRadioSelection('existing-row')}
            />
          </PopupTdForRadio>
          <PopupTd colSpan={3}>
            <Select
              label="Add to existing row"
              value={selectedExistingRow}
              onChange={(e) => {
                setSelectedExistingRow(e.target.value)
                setSelectedRadioOption('existing-row')
                updateAnnotationsForPoint('existing-row')
              }}
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
          {benthicAttributeSelectOptions.length && growthFormSelectOptions.length ? (
            <>
              <PopupTdForRadio>
                <input
                  type="radio"
                  id="new-row-point-selection"
                  name="new-row-point-selection"
                  value="new-row"
                  checked={selectedRadioOption === 'new-row'}
                  onChange={() => handleRadioSelection('new-row')}
                />
              </PopupTdForRadio>
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
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <option value=""> </option>
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
            <PopupTd colSpan={4}>
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
  selectedRadioOption: PropTypes.string.isRequired,
  handleRadioSelection: PropTypes.func.isRequired,
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
