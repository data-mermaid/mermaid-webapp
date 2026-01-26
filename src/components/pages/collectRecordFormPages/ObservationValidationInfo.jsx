import React from 'react'
import PropTypes from 'prop-types'

import { CellValidation, TableValidationList } from './CollectingFormPage.Styles'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'
import { getValidationMessage } from '../../../library/validationMessageHelpers'

const ObservationValidationInfo = ({
  ignoreObservationValidations,
  observationId,
  resetObservationValidations,
  isObservationValid,
  hasObservationWarningValidation,
  hasObservationErrorValidation,
  hasObservationIgnoredValidation,
  observationValidationMessages,
  observationValidationType,
}) => {
  const handleIgnoreWarningChange = async (event) => {
    const isIgnoreChecked = event.target.checked

    if (isIgnoreChecked) {
      ignoreObservationValidations({
        observationId,
      })
    }
    if (!isIgnoreChecked) {
      resetObservationValidations({
        observationId,
      })
    }
  }

  return (
    <CellValidation>
      {isObservationValid ? <span aria-label="Passed Validation">&nbsp;</span> : null}
      {hasObservationErrorValidation || hasObservationWarningValidation ? (
        <TableValidationList>
          {observationValidationMessages.map((validation) => (
            <li className={`${observationValidationType}-indicator`} key={validation.id}>
              {getValidationMessage(validation)}
            </li>
          ))}
        </TableValidationList>
      ) : null}
      {hasObservationIgnoredValidation ? <>Ignored</> : null}
      {hasObservationWarningValidation || hasObservationIgnoredValidation ? (
        <InputIgnoreValidationWarningCheckboxWithLabel
          onChange={handleIgnoreWarningChange}
          checked={hasObservationIgnoredValidation}
        />
      ) : null}
    </CellValidation>
  )
}

ObservationValidationInfo.propTypes = {
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationId: PropTypes.string.isRequired,
  resetObservationValidations: PropTypes.func.isRequired,
  isObservationValid: PropTypes.bool.isRequired,
  hasObservationWarningValidation: PropTypes.bool.isRequired,
  hasObservationErrorValidation: PropTypes.bool.isRequired,
  hasObservationIgnoredValidation: PropTypes.bool.isRequired,
  observationValidationMessages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  observationValidationType: PropTypes.string.isRequired,
}

export default ObservationValidationInfo
