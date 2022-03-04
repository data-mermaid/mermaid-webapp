import React from 'react'
import PropTypes from 'prop-types'
import { formikPropType } from '../../../library/formikPropType'

import { ButtonCallout } from '../buttons'
import { IconSave } from '../../icons'
import { buttonGroupStates } from '../../../library/buttonGroupStates'

const SaveButton = ({ formId, saveButtonState, formik }) => {
  const doesFormikHaveErrors = Object.keys(formik.errors).length
  const isSaveButtonDisabled =
    !formik.dirty || doesFormikHaveErrors || saveButtonState === buttonGroupStates.saving

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
    <ButtonCallout type="submit" form={formId} disabled={isSaveButtonDisabled}>
      <IconSave />
      {getSaveButtonText()}
    </ButtonCallout>
  )
}

SaveButton.propTypes = {
  formik: formikPropType.isRequired,
  formId: PropTypes.string.isRequired,
  saveButtonState: PropTypes.string.isRequired,
}

export default SaveButton
