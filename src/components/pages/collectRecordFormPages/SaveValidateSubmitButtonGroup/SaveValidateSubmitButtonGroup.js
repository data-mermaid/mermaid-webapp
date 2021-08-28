import { useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import { ButtonCallout, ButtonPrimary } from '../../../generic/buttons'
import { IconSave, IconCheck, IconUpload } from '../../../icons'
import { buttonGroupStage } from '../buttonGroupStage'
import OfflineHide from '../../../generic/OfflineHide'

const SaveValidateSubmitButtonWrapper = styled('div')`
  justify-self: end;
  button {
    white-space: nowrap;
    margin-left: 1px;
  }
`

const SaveValidateSubmitButtonGroup = ({
  isNewRecord,
  fishBeltButtonsState,
  validateRecord,
}) => {
  const { dirty: formDirty } = useFormikContext()
  const [currentButtonsState, setCurrentButtonsState] = useState(
    fishBeltButtonsState,
  )

  const _updateButtonState = useEffect(() => {
    setCurrentButtonsState(fishBeltButtonsState)
  }, [fishBeltButtonsState])

  const _inputChangeSetPageUnsaved = useEffect(() => {
    if (formDirty) {
      setCurrentButtonsState(buttonGroupStage.unsaved)
    }
  }, [formDirty])

  const buttonSavingOrSaved = () =>
    currentButtonsState === buttonGroupStage.saving ? (
      <ButtonPrimary disabled>
        <IconSave />
        Saving
      </ButtonPrimary>
    ) : (
      <ButtonPrimary disabled>
        <IconSave />
        Saved
      </ButtonPrimary>
    )

  const saveButton = formDirty ? (
    <ButtonCallout type="submit" form="fishbelt-form">
      <IconSave />
      Save
    </ButtonCallout>
  ) : (
    buttonSavingOrSaved()
  )

  const validateButtonSwitch = () => {
    switch (currentButtonsState) {
      case buttonGroupStage.validating:
        return (
          <ButtonPrimary disabled>
            <IconCheck />
            Validating
          </ButtonPrimary>
        )
      case buttonGroupStage.validated:
        return (
          <ButtonPrimary disabled>
            <IconCheck />
            Validated
          </ButtonPrimary>
        )
      default:
        return (
          <ButtonCallout
            onClick={validateRecord}
            disabled={currentButtonsState !== buttonGroupStage.saved}
          >
            <IconCheck />
            Validate
          </ButtonCallout>
        )
    }
  }

  const submitButton = (
    <ButtonCallout
      disabled={currentButtonsState !== buttonGroupStage.validated}
    >
      <IconUpload />
      Submit
    </ButtonCallout>
  )

  return (
    <SaveValidateSubmitButtonWrapper data-testid="fishbelt-form-buttons">
      {saveButton}
      {!isNewRecord && (
        <OfflineHide>
          {validateButtonSwitch()}
          {submitButton}
        </OfflineHide>
      )}
    </SaveValidateSubmitButtonWrapper>
  )
}

SaveValidateSubmitButtonGroup.propTypes = {
  isNewRecord: PropTypes.bool.isRequired,
  fishBeltButtonsState: PropTypes.number.isRequired,
  validateRecord: PropTypes.func.isRequired,
}

export default SaveValidateSubmitButtonGroup
