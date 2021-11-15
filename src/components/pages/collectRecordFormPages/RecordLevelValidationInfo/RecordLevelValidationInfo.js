import React from 'react'
import PropTypes from 'prop-types'
import { ValidationMessage } from '../../../generic/form'
import { Row } from '../../../generic/positioning'
import { ButtonSecondary } from '../../../generic/buttons'

const RecordLevelValidationInfo = ({
  areValidationsShowing,
  ignoreRecordLevelValidation,
  resetRecordLevelValidation,
  validations,
}) => {
  return (
    <ul data-testid="record-level-validations">
      {validations.map((validation) => {
        const { status, validation_id } = validation
        const isWarning = status === 'warning'
        const isError = status === 'error'
        const isIgnored = status === 'ignore'
        const isReset = status === 'reset'

        return (isError || isWarning || isIgnored || isReset) && areValidationsShowing ? (
          <Row as="li" key={validation_id}>
            <ValidationMessage validationType={status}>
              {isIgnored ? `Ignored: ${validation.name}` : validation.name}
            </ValidationMessage>
            {isIgnored ? (
              <ButtonSecondary
                type="button"
                onClick={() =>
                  resetRecordLevelValidation({ validationId: validation.validation_id })
                }
              >
                Reset validation
              </ButtonSecondary>
            ) : null}
            {isWarning || isReset ? (
              <ButtonSecondary
                type="button"
                onClick={() =>
                  ignoreRecordLevelValidation({ validationId: validation.validation_id })
                }
              >
                Ignore warning
              </ButtonSecondary>
            ) : null}
          </Row>
        ) : null
      })}
    </ul>
  )
}

RecordLevelValidationInfo.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  ignoreRecordLevelValidation: PropTypes.func.isRequired,
  resetRecordLevelValidation: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
}

export default RecordLevelValidationInfo
