import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import { ButtonCallout } from '../../../generic/buttons'
import { IconSave, IconCheck, IconUpload } from '../../../icons'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import OfflineHide from '../../../generic/OfflineHide'

const SaveValidateSubmitButtonWrapper = styled('div')`
  justify-self: end;
  display: flex;
  gap: 1px;
  button {
    white-space: nowrap;
  }
`

const SaveValidateSubmitButtonGroup = ({
  isNewRecord,
  onSave,
  onSubmit,
  onValidate,
  saveButtonState,
  submitButtonState,
  validateButtonState,
}) => {
  const getSaveButtonText = () => {
    if (saveButtonState === buttonGroupStates.saving) {
      return 'Saving'
    }
    if (
      saveButtonState === buttonGroupStates.saved ||
      saveButtonState === buttonGroupStates.validating
    ) {
      return 'Saved'
    }

    return 'Save'
  }

  const getValidateButtonText = () => {
    if (validateButtonState === buttonGroupStates.validating) {
      return 'Validating'
    }
    if (validateButtonState === buttonGroupStates.validated) {
      return 'Validated'
    }

    return 'Validate'
  }

  const getSubmitButtonText = () =>
    submitButtonState === buttonGroupStates.submitting ? 'Submitting' : 'Submit'

  const isSaveDisabled =
    saveButtonState === buttonGroupStates.saved ||
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validating

  const isValidateDisabled =
    saveButtonState === buttonGroupStates.unsaved ||
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validated ||
    validateButtonState === buttonGroupStates.validating

  const isSubmitDisabled =
    submitButtonState === buttonGroupStates.submitting ||
    validateButtonState === buttonGroupStates.validatable ||
    validateButtonState === buttonGroupStates.validating ||
    saveButtonState === buttonGroupStates.unsaved ||
    saveButtonState === buttonGroupStates.saving

  const saveButton = (
    <ButtonCallout type="button" disabled={isSaveDisabled} onClick={onSave}>
      <IconSave />
      {getSaveButtonText()}
    </ButtonCallout>
  )

  const validateButton = (
    <ButtonCallout onClick={onValidate} disabled={isValidateDisabled}>
      <IconCheck />
      {getValidateButtonText()}
    </ButtonCallout>
  )

  const submitButton = (
    <ButtonCallout disabled={isSubmitDisabled} onClick={onSubmit}>
      <IconUpload />
      {getSubmitButtonText()}
    </ButtonCallout>
  )

  return (
    <SaveValidateSubmitButtonWrapper data-testid="collect-record-form-buttons">
      {saveButton}
      {!isNewRecord && (
        <OfflineHide>
          {validateButton}
          {submitButton}
        </OfflineHide>
      )}
    </SaveValidateSubmitButtonWrapper>
  )
}

SaveValidateSubmitButtonGroup.propTypes = {
  isNewRecord: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  saveButtonState: PropTypes.string.isRequired,
  submitButtonState: PropTypes.string.isRequired,
  validateButtonState: PropTypes.string.isRequired,
}

export default SaveValidateSubmitButtonGroup
