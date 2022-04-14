import React from 'react'
import styled, { css } from 'styled-components/macro'
import PropTypes from 'prop-types'
import { ValidationList } from '../../../generic/form'
import { ButtonSecondary } from '../../../generic/buttons'
import theme from '../../../../theme'
import InlineMessage from '../../../generic/InlineMessage/InlineMessage'
import language from '../../../../language'
import { hoverState } from '../../../../library/styling/mediaQueries'

export const InlineValidationButton = styled(ButtonSecondary)`
  margin: ${theme.spacing.xxsmall};
  padding: ${theme.spacing.xxsmall} ${theme.spacing.small};
  font-size: inherit;
  text-align: left;
  text-transform: capitalize;
  font-size: smaller;
  white-space: nowrap;
  color: ${theme.color.textColor};
`

const InlineValidationItem = styled.li`
  ${hoverState(css`
    background: ${theme.color.tableRowHover};
  `)}
`
const RecordLevelValidationInfo = ({
  areValidationsShowing,
  ignoreRecordLevelValidation,
  resetRecordLevelValidation,
  validations,
}) => {
  return (
    <ValidationList data-testid="record-level-validations">
      {validations.map((validation) => {
        const { status, validation_id } = validation
        const isWarning = status === 'warning'
        const isError = status === 'error'
        const isIgnored = status === 'ignore'
        const isReset = status === 'reset'
        const statusForStyling = isReset ? 'warning' : status

        const validationMessage = language.getValidationMessage(validation)

        return (isError || isWarning || isIgnored || isReset) && areValidationsShowing ? (
          <InlineValidationItem key={validation_id}>
            <InlineMessage type={statusForStyling}>
              <p>{isIgnored ? validationMessage : validationMessage}</p>
            </InlineMessage>
            {isWarning || isReset ? (
              <InlineValidationButton
                type="button"
                onClick={() =>
                  ignoreRecordLevelValidation({ validationId: validation.validation_id })
                }
              >
                Ignore
              </InlineValidationButton>
            ) : null}
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
          </InlineValidationItem>
        ) : null
      })}
    </ValidationList>
  )
}

RecordLevelValidationInfo.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  ignoreRecordLevelValidation: PropTypes.func.isRequired,
  resetRecordLevelValidation: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
}

export default RecordLevelValidationInfo
