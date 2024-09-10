import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import ObservationAutocomplete from '../../../../ObservationAutocomplete/ObservationAutocomplete'
import { Select } from '../../../../generic/form'
import { ButtonSecondary } from '../../../../generic/buttons'
import language from '../../../../../language'
import { Tr } from '../../../../generic/Table/table'
import { getBenthicOptions } from '../../../../../library/getOptions'
import {
  PopupTd,
  PopupTdForRadio,
  PopupInputAutocompleteContainer,
} from '../ImageAnnotationModal.styles'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'

const NewRow = ({
  selectedPoint,
  dataToReview,
  setDataToReview,
  selectedRadioOption,
  setSelectedRadioOption,
  databaseSwitchboardInstance,
}) => {
  const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])
  const [growthFormSelectOptions, setGrowthFormSelectOptions] = useState([])
  const [selectedNewRowValues, setSelectedNewRowValues] = useState({
    benthicAttr: '',
    growthForm: '',
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

  const handleRadioSelection = () => {
    setSelectedRadioOption('new-row')
    if (selectedNewRowValues.benthicAttr) {
      addNewAnnotation(selectedNewRowValues.benthicAttr, selectedNewRowValues.growthForm)
    }
  }

  const handleBenthicAttributeSelection = ({ benthicAttrId }) => {
    setSelectedNewRowValues({ ...selectedNewRowValues, benthicAttr: benthicAttrId })
    setSelectedRadioOption('new-row')
    addNewAnnotation(benthicAttrId, selectedNewRowValues.growthForm)
  }

  const handleGrowthFormSelection = (growthFormId) => {
    setSelectedNewRowValues({ ...selectedNewRowValues, growthForm: growthFormId })
    if (selectedNewRowValues.benthicAttr) {
      setSelectedRadioOption('new-row')
      addNewAnnotation(selectedNewRowValues.benthicAttr, growthFormId)
    }
  }

  const addNewAnnotation = (benthicAttr, growthForm) => {
    // TODO: if classifier guess, use that instead
    const updatedAnnotations = [
      {
        benthic_attribute: benthicAttr,
        growth_form: growthForm || null,
        is_confirmed: true,
      },
      ...selectedPoint.annotations,
    ]

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )
    setDataToReview({ ...dataToReview, points: updatedPoints })
  }

  return (
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
              onChange={handleRadioSelection}
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
          <ButtonSecondary onClick={handleDisplayNewRowSelection}>Choose Attribute</ButtonSecondary>
        </PopupTd>
      )}
    </Tr>
  )
}

NewRow.propTypes = {
  selectedPoint: imageClassificationPointPropType.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  selectedRadioOption: PropTypes.string.isRequired,
  setSelectedRadioOption: PropTypes.func.isRequired,
  databaseSwitchboardInstance: PropTypes.object.isRequired,
}

export default NewRow
