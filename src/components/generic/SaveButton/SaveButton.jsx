import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { ButtonCallout } from '../buttons'
import { IconSave } from '../../icons'
import { buttonGroupStates } from '../../../library/buttonGroupStates'

const SaveButton = ({ formId, saveButtonState, formHasErrors, formDirty }) => {
  const { t } = useTranslation()

  const isSaveButtonDisabled =
    !formDirty || formHasErrors || saveButtonState === buttonGroupStates.saving

  const getSaveButtonText = () => {
    switch (saveButtonState) {
      case buttonGroupStates.saving:
        return t('buttons.saving')
      case buttonGroupStates.saved:
        return t('buttons.saved')
      default:
        return t('buttons.save')
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
