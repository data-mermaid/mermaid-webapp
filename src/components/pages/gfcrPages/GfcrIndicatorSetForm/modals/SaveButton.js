import React from 'react'
import PropTypes from 'prop-types'

import { buttonGroupStates } from '../../../../../library/buttonGroupStates'
import { ButtonPrimary } from '../../../../generic/buttons'

const SaveButton = ({ formId, unsavedTitle, saveButtonState, formHasErrors, formDirty }) => {
  const isSaveButtonDisabled =
    !formDirty || formHasErrors || saveButtonState === buttonGroupStates.saving

  const getSaveButtonText = () => {
    switch (saveButtonState) {
      case buttonGroupStates.saving:
        return 'Saving'
      default:
        return unsavedTitle
    }
  }

  return (
    <ButtonPrimary type="submit" form={formId} disabled={isSaveButtonDisabled}>
      {getSaveButtonText()}
    </ButtonPrimary>
  )
}

SaveButton.propTypes = {
  formHasErrors: PropTypes.bool.isRequired,
  unsavedTitle: PropTypes.string.isRequired,
  formDirty: PropTypes.bool.isRequired,
  formId: PropTypes.string.isRequired,
  saveButtonState: PropTypes.string.isRequired,
}

export default SaveButton
