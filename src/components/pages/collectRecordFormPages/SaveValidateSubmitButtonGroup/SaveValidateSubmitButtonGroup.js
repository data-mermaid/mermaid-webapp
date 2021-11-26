import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import { ButtonCallout } from '../../../generic/buttons'
import { IconSave, IconCheck, IconUpload } from '../../../icons'
import { possibleCollectButtonGroupStates } from '../possibleCollectButtonGroupStates'
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
  onValidate,
  saveButtonState,
  validateButtonState,
}) => {
  const getSaveButtonText = () => {
    if (saveButtonState === possibleCollectButtonGroupStates.saving) {
      return 'Saving'
    }
    if (
      saveButtonState === possibleCollectButtonGroupStates.saved ||
      saveButtonState === possibleCollectButtonGroupStates.validating
    ) {
      return 'Saved'
    }

    return 'Save'
  }

  const getValidateButtonText = () => {
    if (validateButtonState === possibleCollectButtonGroupStates.validating) {
      return 'Validating'
    }
    if (validateButtonState === possibleCollectButtonGroupStates.validated) {
      return 'Validated'
    }

    return 'Validate'
  }

  const isSaveDisabled =
    saveButtonState === possibleCollectButtonGroupStates.saved ||
    saveButtonState === possibleCollectButtonGroupStates.saving ||
    validateButtonState === possibleCollectButtonGroupStates.validating

  const isValidateDisabled =
    saveButtonState === possibleCollectButtonGroupStates.unsaved ||
    saveButtonState === possibleCollectButtonGroupStates.saving ||
    validateButtonState === possibleCollectButtonGroupStates.validated ||
    validateButtonState === possibleCollectButtonGroupStates.validating

  const isSubmitDisabled =
    validateButtonState === possibleCollectButtonGroupStates.validating ||
    validateButtonState === possibleCollectButtonGroupStates.validatable ||
    saveButtonState === possibleCollectButtonGroupStates.unsaved ||
    saveButtonState === possibleCollectButtonGroupStates.saving

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
    <ButtonCallout disabled={isSubmitDisabled}>
      <IconUpload />
      Submit
    </ButtonCallout>
  )

  return (
    <SaveValidateSubmitButtonWrapper data-testid="fishbelt-form-buttons">
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
  onValidate: PropTypes.func.isRequired,
  saveButtonState: PropTypes.string.isRequired,
  validateButtonState: PropTypes.string.isRequired,
}

export default SaveValidateSubmitButtonGroup
