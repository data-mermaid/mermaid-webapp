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
  setButtonGroupWhenFormDirty,
}) => {
  const { dirty: formDirty } = useFormikContext()

  const _inputChangeSetPageUnsaved = useEffect(() => {
    if (formDirty) {
      setButtonGroupWhenFormDirty()
    }
  }, [formDirty, setButtonGroupWhenFormDirty])

  const saveButtonSwitch = () => {
    if (fishBeltButtonsState === buttonGroupStage.saving) {
      return (
        <ButtonPrimary disabled>
          <IconSave />
          Saving
        </ButtonPrimary>
      )
    }
    if (
      fishBeltButtonsState === buttonGroupStage.saved ||
      fishBeltButtonsState === buttonGroupStage.validating
    ) {
      return (
        <ButtonPrimary disabled>
          <IconSave />
          Saved
        </ButtonPrimary>
      )
    }

    return (
      <ButtonCallout type="submit" form="fishbelt-form">
        <IconSave />
        Save
      </ButtonCallout>
    )
  }

  const validateButtonSwitch = () => {
    if (fishBeltButtonsState === buttonGroupStage.validating) {
      return (
        <ButtonPrimary disabled>
          <IconCheck />
          Validating
        </ButtonPrimary>
      )
    }
    if (fishBeltButtonsState === buttonGroupStage.validated) {
      return (
        <ButtonPrimary disabled>
          <IconCheck />
          Validated
        </ButtonPrimary>
      )
    }

    return (
      <ButtonCallout
        onClick={validateRecord}
        disabled={fishBeltButtonsState !== buttonGroupStage.saved}
      >
        <IconCheck />
        Validate
      </ButtonCallout>
    )
  }

  const submitButton = (
    <ButtonCallout
      disabled={fishBeltButtonsState !== buttonGroupStage.validated}
    >
      <IconUpload />
      Submit
    </ButtonCallout>
  )

  return (
    <SaveValidateSubmitButtonWrapper data-testid="fishbelt-form-buttons">
      {saveButtonSwitch()}
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
  fishBeltButtonsState: PropTypes.string.isRequired,
  validateRecord: PropTypes.func.isRequired,
  setButtonGroupWhenFormDirty: PropTypes.func.isRequired,
}

export default SaveValidateSubmitButtonGroup
