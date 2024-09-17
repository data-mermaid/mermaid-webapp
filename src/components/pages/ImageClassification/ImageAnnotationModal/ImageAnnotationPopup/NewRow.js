import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { Select } from '../../../../generic/form'
import { ButtonPrimary, ButtonSecondary } from '../../../../generic/buttons'
import language from '../../../../../language'
import { Tr, Td } from '../../../../generic/Table/table'
import { getBenthicOptions } from '../../../../../library/getOptions'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'
import { IconPlus } from '../../../../icons'
import Modal from '../../../../generic/Modal/Modal'
import InputAutocomplete from '../../../../generic/InputAutocomplete'
import { NewRowContainer, NewRowFooterContainer, NewRowLabel } from '../ImageAnnotationModal.styles'
import { createPortal } from 'react-dom'

// TODO: Place this in a shared folder since used twice?
const isAClassifierGuessOfSelectedPoint = (annotations, benthic_attribute, growth_form) =>
  annotations.some(
    (annotation) =>
      annotation.is_machine_created &&
      annotation.benthic_attribute === benthic_attribute &&
      annotation.growth_form === growth_form,
  )

const NewRow = ({ selectedPoint, dataToReview, setDataToReview, databaseSwitchboardInstance }) => {
  const [shouldDisplayModal, setShouldDisplayModal] = useState(false)
  const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])
  const [growthFormSelectOptions, setGrowthFormSelectOptions] = useState([])
  const [selectedBenthicAttr, setSelectedBenthicAttr] = useState('')
  const [selectedGrowthForm, setSelectedGrowthForm] = useState('')

  const handleDisplayNewRowSelection = () => {
    const promises = [
      databaseSwitchboardInstance.getBenthicAttributes(),
      databaseSwitchboardInstance.getChoices(),
    ]

    Promise.all(promises)
      .then(([benthicAttributes, choices]) => {
        setBenthicAttributeSelectOptions(getBenthicOptions(benthicAttributes))
        setGrowthFormSelectOptions(choices.growthforms.data)
        setShouldDisplayModal(true)
      })
      .catch(() => {
        toast.error('Failed to retrieve benthic attributes and growth forms')
      })
  }

  const handleCloseModal = () => {
    setSelectedBenthicAttr('')
    setSelectedGrowthForm('')
    setShouldDisplayModal(false)
  }

  const selectClassifierGuessAsConfirmedAnnotation = () => {
    const updatedAnnotations = selectedPoint.annotations.reduce((acc, currentAnnotation) => {
      const { benthic_attribute, growth_form, is_machine_created } = currentAnnotation

      // only want classifier guesses
      if (!is_machine_created) {
        return acc
      }

      // Move the matching classifier guess to front of array and confirm. Unconfirm the rest.
      if (
        benthic_attribute === selectedBenthicAttr &&
        growth_form === (selectedGrowthForm || null)
      ) {
        acc.unshift({ ...currentAnnotation, is_confirmed: true })
      } else {
        acc.push({ ...currentAnnotation, is_confirmed: false })
      }

      return acc
    }, [])

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )

    setDataToReview({ ...dataToReview, points: updatedPoints })
    handleCloseModal()
  }

  const addNewAnnotation = () => {
    // Only want classifier guesses, and want them unconfirmed.
    const resetAnnotationsForPoint = selectedPoint.annotations.reduce((acc, currentAnnotation) => {
      if (currentAnnotation.is_machine_created) {
        acc.push({ ...currentAnnotation, is_confirmed: false })
      }

      return acc
    }, [])

    const annotationToAdd = {
      benthic_attribute: selectedBenthicAttr,
      growth_form: selectedGrowthForm || null,
      is_confirmed: true,
      is_machine_created: false,
    }

    const updatedAnnotations = [annotationToAdd, ...resetAnnotationsForPoint]

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )

    setDataToReview({ ...dataToReview, points: updatedPoints })
    handleCloseModal()
  }

  const handleAddNewRowClick = () => {
    if (
      isAClassifierGuessOfSelectedPoint(
        selectedPoint.annotations,
        selectedBenthicAttr,
        selectedGrowthForm || null,
      )
    ) {
      selectClassifierGuessAsConfirmedAnnotation()
    } else {
      addNewAnnotation()
    }
  }

  return (
    <>
      <Tr>
        <Td colSpan={4} align="center">
          <ButtonSecondary type="button" onClick={handleDisplayNewRowSelection}>
            <IconPlus /> Select New Attribute
          </ButtonSecondary>
        </Td>
      </Tr>
      {createPortal(
        <Modal
          title="Select New Attribute"
          isOpen={
            benthicAttributeSelectOptions.length &&
            growthFormSelectOptions.length &&
            shouldDisplayModal
          }
          onDismiss={handleCloseModal}
          allowCloseWithEscapeKey={false}
          maxWidth="fit-content"
          contentOverflowIsVisible
          mainContent={
            <NewRowContainer>
              <NewRowLabel htmlFor="benthic-attribute-autocomplete">
                Benthic Attribute
                <InputAutocomplete
                  id="benthic-attribute-autocomplete"
                  autoFocus
                  aria-labelledby="benthic-attribute-label"
                  options={benthicAttributeSelectOptions}
                  onChange={({ value }) => setSelectedBenthicAttr(value)}
                  value={selectedBenthicAttr}
                  noResultsText={language.autocomplete.noResultsDefault}
                />
              </NewRowLabel>

              <NewRowLabel htmlFor="growth-forms">
                <span>Growth forms</span>
                <Select
                  id="growth-forms"
                  label="Growth forms"
                  onChange={(e) => setSelectedGrowthForm(e.target.value)}
                >
                  <option value=""></option>
                  {growthFormSelectOptions.map((growthForm) => (
                    <option key={growthForm.id} value={growthForm.id}>
                      {growthForm.name}
                    </option>
                  ))}
                </Select>
              </NewRowLabel>
            </NewRowContainer>
          }
          footerContent={
            <NewRowFooterContainer>
              <ButtonSecondary type="button" onClick={handleCloseModal}>
                Cancel
              </ButtonSecondary>
              <ButtonPrimary
                type="button"
                disabled={!selectedBenthicAttr}
                onClick={handleAddNewRowClick}
              >
                Add New Row
              </ButtonPrimary>
            </NewRowFooterContainer>
          }
        />,
        document.body,
      )}
    </>
  )
}

NewRow.propTypes = {
  selectedPoint: imageClassificationPointPropType.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  databaseSwitchboardInstance: PropTypes.object.isRequired,
}

export default NewRow
