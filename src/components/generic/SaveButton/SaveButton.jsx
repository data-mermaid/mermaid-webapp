import React from 'react'
import PropTypes from 'prop-types'

import { ButtonCallout } from '../buttons'
import { IconSave } from '../../icons'
import { buttonGroupStates } from '../../../library/buttonGroupStates'

const SaveButton = ({ formId, saveButtonState, formHasErrors, formDirty }) => {
  const isSaveButtonDisabled =
    !formDirty || formHasErrors || saveButtonState === buttonGroupStates.saving

  const getSaveButtonText = () => {
    switch (saveButtonState) {
      case buttonGroupStates.saving:
        return 'Saving'
      case buttonGroupStates.saved:
        return 'Saved'
      default:
        return 'Save'
    }
  }

  return (
    <ButtonCallout
      type="submit"
      form={formId}
      disabled={isSaveButtonDisabled}
      data-testid={`save-button-${formId}`}
    >
      <IconSave />
      {getSaveButtonText()}
    </ButtonCallout>
  )
}

SaveButton.propTypes = {
  formHasErrors: PropTypes.bool.isRequired,
  formDirty: PropTypes.bool.isRequired,
  formId: PropTypes.string.isRequired,
  saveButtonState: PropTypes.string.isRequired,
}

export default SaveButton
