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

const SaveValidateSubmitButtonGroup = ({ isNewRecord, fishBeltButtonsState, validateRecord }) => {
  const saveButtonSwitch = () => {
    if (fishBeltButtonsState === possibleCollectButtonGroupStates.saving) {
      return (
        <ButtonCallout disabled>
          <IconSave />
          Saving
        </ButtonCallout>
      )
    }
    if (
      fishBeltButtonsState === possibleCollectButtonGroupStates.saved ||
      fishBeltButtonsState === possibleCollectButtonGroupStates.validating
    ) {
      return (
        <ButtonCallout disabled>
          <IconSave />
          Saved
        </ButtonCallout>
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
    if (fishBeltButtonsState === possibleCollectButtonGroupStates.validating) {
      return (
        <ButtonCallout disabled>
          <IconCheck />
          Validating
        </ButtonCallout>
      )
    }
    if (fishBeltButtonsState === possibleCollectButtonGroupStates.validated) {
      return (
        <ButtonCallout disabled>
          <IconCheck />
          Validated
        </ButtonCallout>
      )
    }

    return (
      <ButtonCallout
        onClick={validateRecord}
        disabled={fishBeltButtonsState !== possibleCollectButtonGroupStates.saved}
      >
        <IconCheck />
        Validate
      </ButtonCallout>
    )
  }

  const submitButton = (
    <ButtonCallout disabled={fishBeltButtonsState !== possibleCollectButtonGroupStates.validated}>
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
}

export default SaveValidateSubmitButtonGroup
