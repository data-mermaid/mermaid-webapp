import React from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'
import { ValidationMessage } from '../../../generic/form'
import { ButtonSecondary } from '../../../generic/buttons'
import theme from '../../../../theme'

const RecordLevelValidationList = styled('ul')`
  list-style: none;
  padding: ${theme.spacing.medium};
  margin: 0;
  li {
    display: flex;
    justify-content: space-between;
    span {
      margin: ${theme.spacing.xxsmall} 0;
      display: block;
      width: 100%;
      padding: ${theme.spacing.small};
    }
  }
`
const InlineValidationButton = styled(ButtonSecondary)`
  margin: ${theme.spacing.xxsmall};
  margin-right: 0;
  white-space: nowrap;
  padding: ${theme.spacing.small};
  text-transform: capitalize;
`
const RecordLevelValidationInfo = ({
  areValidationsShowing,
  ignoreRecordLevelValidation,
  resetRecordLevelValidation,
  validations,
}) => {
  return (
    <RecordLevelValidationList data-testid="record-level-validations">
      {validations.map((validation) => {
        const { status, validation_id } = validation
        const isWarning = status === 'warning'
        const isError = status === 'error'
        const isIgnored = status === 'ignore'
        const isReset = status === 'reset'

        return (isError || isWarning || isIgnored || isReset) && areValidationsShowing ? (
          <li key={validation_id}>
            <ValidationMessage validationType={status}>
              {isIgnored ? `Ignored: ${validation.name}` : validation.name}
            </ValidationMessage>
            {isIgnored ? (
              <InlineValidationButton
                type="button"
                onClick={() =>
                  resetRecordLevelValidation({ validationId: validation.validation_id })
                }
              >
                Reset validation
              </InlineValidationButton>
            ) : null}
            {isWarning || isReset ? (
              <InlineValidationButton
                type="button"
                onClick={() =>
                  ignoreRecordLevelValidation({ validationId: validation.validation_id })
                }
              >
                Ignore warning
              </InlineValidationButton>
            ) : null}
          </li>
        ) : null
      })}
    </RecordLevelValidationList>
  )
}

RecordLevelValidationInfo.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  ignoreRecordLevelValidation: PropTypes.func.isRequired,
  resetRecordLevelValidation: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
}

export default RecordLevelValidationInfo
