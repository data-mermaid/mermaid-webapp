import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import { ButtonCallout, ButtonPrimary } from '../../../generic/buttons'
import { IconSave, IconCheck, IconUpload } from '../../../icons'
import { possibleCollectButtonGroupStates } from '../possibleCollectButtonGroupStates'
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
  const saveButtonSwitch = () => {
    if (fishBeltButtonsState === possibleCollectButtonGroupStates.saving) {
      return (
        <ButtonPrimary disabled>
          <IconSave />
          Saving
        </ButtonPrimary>
      )
    }
    if (
      fishBeltButtonsState === possibleCollectButtonGroupStates.saved ||
      fishBeltButtonsState === possibleCollectButtonGroupStates.validating
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
    if (fishBeltButtonsState === possibleCollectButtonGroupStates.validating) {
      return (
        <ButtonPrimary disabled>
          <IconCheck />
          Validating
        </ButtonPrimary>
      )
    }
    if (fishBeltButtonsState === possibleCollectButtonGroupStates.validated) {
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
        disabled={fishBeltButtonsState !== possibleCollectButtonGroupStates.saved}
      >
        <IconCheck />
        Validate
      </ButtonCallout>
    )
  }

  const submitButton = (
    <ButtonCallout
      disabled={fishBeltButtonsState !== possibleCollectButtonGroupStates.validated}
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
}

export default SaveValidateSubmitButtonGroup
