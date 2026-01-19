import React from 'react'
import { useTranslation } from 'react-i18next'

import { ButtonCallout } from './buttons'
import { IconSave } from '../icons'
import { buttonGroupStates } from '../../library/buttonGroupStates'

interface SaveButtonProps {
  formId: string
  saveButtonState: string
  formHasErrors: boolean
  formDirty: boolean
}

const SaveButton = ({ formId, saveButtonState, formHasErrors, formDirty }: SaveButtonProps) => {
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

export default SaveButton
