import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { ButtonCallout } from '../../../generic/buttons'
import { IconCheck, IconSave, IconUpload } from '../../../icons'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import OfflineHide from '../../../generic/OfflineHide'
import theme from '../../../../theme'

const SaveValidateSubmitButtonWrapper = styled('div')`
  padding-right: ${theme.spacing.xlarge};

  button {
    white-space: nowrap;
  }
`
const pointerSize = '1rem'
const borderSize = '1px'
const clipPath = `polygon(
  calc(100% - ${pointerSize}) 0%,
  100% 50%,
  calc(100% - ${pointerSize}) 100%,
  0% 100%,
  ${pointerSize} 50%,
  0% 0%)`

const ArrowRightButton = styled(ButtonCallout)`
  clip-path: ${clipPath};
  z-index: 1;
  margin-right: calc(-${pointerSize} + 2px);
  color: ${theme.color.calloutText};
  border: none;
  padding: ${theme.spacing.small} ${theme.spacing.xlarge};
  position: relative;
  background: ${theme.color.calloutBorder};

  &:before {
    clip-path: ${clipPath};
    z-index: -1;
    background: ${theme.color.white};
    pointer-events: none;
    content: '';
    position: absolute;
    top: ${borderSize};
    left: ${borderSize};
    right: ${borderSize};
    bottom: ${borderSize};
  }

  &:not(:disabled):hover {
    cursor: pointer;
    background: ${theme.color.calloutBorder};

    &:before {
      background: ${theme.color.calloutHover};
    }
  }

  &:disabled {
    background-color: ${theme.color.disabledColor};
    color: ${theme.color.disabledTextDark};
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
  const { t } = useTranslation()

  const getSaveButtonText = () => {
    if (saveButtonState === buttonGroupStates.saving) {
      return t('buttons.saving')
    }
    if (
      saveButtonState === buttonGroupStates.saved ||
      saveButtonState === buttonGroupStates.validating
    ) {
      return t('buttons.saved')
    }

    return t('buttons.save')
  }

  const getValidateButtonText = () => {
    if (validateButtonState === buttonGroupStates.validating) {
      return t('buttons.validating')
    }
    if (validateButtonState === buttonGroupStates.validated) {
      return t('buttons.validated')
    }

    return t('buttons.validate')
  }

  const getSubmitButtonText = () =>
    submitButtonState === buttonGroupStates.submitting
      ? t('buttons.submitting')
      : t('buttons.submit')

  const isSaveDisabled =
    saveButtonState === buttonGroupStates.untouchedEmptyForm ||
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
    <ArrowRightButton
      id="gtm-record-save"
      type="button"
      data-testid={
        saveButtonState === buttonGroupStates.saving
          ? 'saving-button'
          : saveButtonState === buttonGroupStates.saved
          ? 'saved-button'
          : 'save-button'
      }
      disabled={isSaveDisabled}
      onClick={onSave}
    >
      <IconSave />
      {getSaveButtonText()}
    </ArrowRightButton>
  )

  const validateButton = (
    <ArrowRightButton
      id="gtm-record-validate"
      data-testid={
        validateButtonState === buttonGroupStates.validating
          ? 'validating-button'
          : validateButtonState === buttonGroupStates.validated
          ? 'validated-button'
          : 'validate-button'
      }
      onClick={onValidate}
      disabled={isValidateDisabled}
    >
      <IconCheck />
      {getValidateButtonText()}
    </ArrowRightButton>
  )

  const submitButton = (
    <ArrowRightButton
      id="gtm-record-submit"
      data-testid={
        submitButtonState === buttonGroupStates.submitting ? 'submitting-button' : 'submit-button'
      }
      disabled={isSubmitDisabled}
      onClick={onSubmit}
    >
      <IconUpload />
      {getSubmitButtonText()}
    </ArrowRightButton>
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
