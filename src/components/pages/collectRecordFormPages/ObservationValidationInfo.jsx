import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'

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
  const { t } = useTranslation()

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
      {isObservationValid ? (
        <span aria-label={t('validations.passed')} data-testid="passed-validation-indicator">
          &nbsp;
        </span>
      ) : null}
      {hasObservationErrorValidation || hasObservationWarningValidation ? (
        <TableValidationList>
          {observationValidationMessages.map((validation) => (
            <li className={`${observationValidationType}-indicator`} key={validation.id}>
              {getValidationMessage(validation)}
            </li>
          ))}
        </TableValidationList>
      ) : null}
      {hasObservationIgnoredValidation ? (
        <span data-testid="ignore-warning-label">{capitalize(t('message_type.ignore'))}</span>
      ) : null}
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
