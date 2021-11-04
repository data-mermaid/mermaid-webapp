import React from 'react'
import PropTypes from 'prop-types'
import { ValidationMessage } from '../../generic/form'
import { Column } from '../../generic/positioning'
import { IconCheck } from '../../icons'
import { ButtonSecondary } from '../../generic/buttons'
import mermaidInputsPropTypes from '../mermaidInputsPropTypes'

const ValidationInfo = ({
  ignoreValidations,
  resetValidations,
  validationMessages,
  validationType,
}) => {
  const areThereValidationMessages = validationMessages.length

  return (
    <Column>
      {areThereValidationMessages &&
      (validationType === 'error' || validationType === 'warning') ? (
        <Column>
          {validationMessages.map((validationMessage) => (
            <ValidationMessage validationType={validationType} key={validationMessage.id}>
              {validationMessage.message}
            </ValidationMessage>
          ))}
        </Column>
      ) : null}
      {validationType === 'ok' ? <IconCheck aria-label="Passed validation" /> : null}
      {validationType === 'ignore' ? (
        <Column>
          Ignored
          <ButtonSecondary type="button" onClick={resetValidations}>
            Reset validations
          </ButtonSecondary>
        </Column>
      ) : null}

      {areThereValidationMessages && validationType === 'warning' ? (
        <ButtonSecondary type="button" onClick={ignoreValidations}>
          Ignore all warnings
        </ButtonSecondary>
      ) : null}
    </Column>
  )
}

ValidationInfo.propTypes = {
  ignoreValidations: PropTypes.func.isRequired,
  resetValidations: PropTypes.func.isRequired,
  validationType: PropTypes.string,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType,
}

ValidationInfo.defaultProps = {
  validationType: undefined,
  validationMessages: [],
}

export default ValidationInfo
