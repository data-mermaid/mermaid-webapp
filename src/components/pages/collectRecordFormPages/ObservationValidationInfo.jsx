import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { TableValidationList } from './CollectingFormPage.Styles'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'
import { getValidationMessage } from '../../../library/validationMessageHelpers'
import { Td } from '../../generic/Table/table'

const ObservationValidationInfo = ({
  ignoreObservationValidations,
  observationId,
  unignoreObservationValidations,
  isObservationValid,
  hasObservationWarningValidation,
  hasObservationErrorValidation,
  hasObservationIgnoredValidation,
  observationValidationMessages,
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
      unignoreObservationValidations({
        observationId,
      })
    }
  }

  return (
    <Td>
      {isObservationValid ? (
        <span aria-label={t('validations.passed')} data-testid="passed-validation-indicator">
          &nbsp;
        </span>
      ) : null}
      {hasObservationErrorValidation || hasObservationWarningValidation ? (
        <TableValidationList>
          {observationValidationMessages.map((validation) => (
            <li className={`${validation.status}-indicator`} key={validation.id}>
              {getValidationMessage(validation)}
            </li>
          ))}
        </TableValidationList>
      ) : null}
      {hasObservationIgnoredValidation ? (
        <span data-testid="ignore-warning-label">{t('validations.ignored')}</span>
      ) : null}
      {hasObservationWarningValidation || hasObservationIgnoredValidation ? (
        <InputIgnoreValidationWarningCheckboxWithLabel
          onChange={handleIgnoreWarningChange}
          checked={hasObservationIgnoredValidation}
        />
      ) : null}
    </Td>
  )
}

ObservationValidationInfo.propTypes = {
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationId: PropTypes.string.isRequired,
  unignoreObservationValidations: PropTypes.func.isRequired,
  isObservationValid: PropTypes.bool.isRequired,
  hasObservationWarningValidation: PropTypes.bool.isRequired,
  hasObservationErrorValidation: PropTypes.bool.isRequired,
  hasObservationIgnoredValidation: PropTypes.bool.isRequired,
  observationValidationMessages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default ObservationValidationInfo
