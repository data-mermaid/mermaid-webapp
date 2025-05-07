import React from 'react'
import InputAutocomplete from '../../../../generic/InputAutocomplete/InputAutocomplete'
import { Select } from '../../../../generic/form'
import language from '../../../../../language'
import {
  NewAttributeModalContentContainer,
  NewAttributeModalFooterContainer,
} from '../ImageAnnotationModal.styles'
import { ButtonPrimary, ButtonSecondary } from '../../../../generic/buttons'
import { IconPlus } from '../../../../icons'
import Modal from '../../../../generic/Modal/Modal'
import PropTypes from 'prop-types'

const NewAttributeModal = ({
  benthicAttributeSelectOptions,
  setSelectedBenthicAttr,
  setSelectedGrowthForm,
  selectedBenthicAttr,
  growthFormSelectOptions,
  shouldDisplayModal,
  handleCloseModal,
  handleAddNewRowClick,
}) => {
  return (
    <Modal
      title={language.table.addNewRow}
      isOpen={
        !!benthicAttributeSelectOptions.length &&
        !!growthFormSelectOptions.length &&
        shouldDisplayModal
      }
      onDismiss={handleCloseModal}
      allowCloseWithEscapeKey={false}
      maxWidth="fit-content"
      mainContent={
        <NewAttributeModalContentContainer>
          <label htmlFor="benthic-attribute-autocomplete">
            {language.createNewOptionModal.newBenthicAttribute}
            <InputAutocomplete
              id="benthic-attribute-autocomplete"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
              aria-labelledby="benthic-attribute-label"
              options={benthicAttributeSelectOptions}
              onChange={({ value }) => setSelectedBenthicAttr(value)}
              value={selectedBenthicAttr}
              noResultsText={language.autocomplete.noResultsDefault}
            />
          </label>

          <label htmlFor="growth-forms">
            <Select
              id="growth-forms"
              label={language.createNewOptionModal.growthForms}
              onChange={(e) => setSelectedGrowthForm(e.target.value)}
            >
              <option value=""></option>
              {growthFormSelectOptions.map((growthForm) => (
                <option key={growthForm.id} value={growthForm.id}>
                  {growthForm.name}
                </option>
              ))}
            </Select>
          </label>
        </NewAttributeModalContentContainer>
      }
      footerContent={
        <NewAttributeModalFooterContainer>
          <ButtonSecondary type="button" onClick={handleCloseModal}>
            {language.buttons.cancel}
          </ButtonSecondary>
          <ButtonPrimary
            type="button"
            disabled={!selectedBenthicAttr}
            onClick={handleAddNewRowClick}
          >
            <IconPlus /> {language.buttons.addRow}
          </ButtonPrimary>
        </NewAttributeModalFooterContainer>
      }
    />
  )
}

export default NewAttributeModal

NewAttributeModal.propTypes = {
  benthicAttributeSelectOptions: PropTypes.array,
  setSelectedBenthicAttr: PropTypes.func.isRequired,
  setSelectedGrowthForm: PropTypes.func.isRequired,
  selectedBenthicAttr: PropTypes.string.isRequired,
  growthFormSelectOptions: PropTypes.array.isRequired,
  shouldDisplayModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleAddNewRowClick: PropTypes.func.isRequired,
}
