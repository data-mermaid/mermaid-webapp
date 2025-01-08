import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import { ButtonSecondary, ButtonThatLooksLikeLink } from '../../../generic/buttons'
import { hoverState } from '../../../../library/styling/mediaQueries'
import { ValidationList } from '../../../generic/form'
import InlineMessage from '../../../generic/InlineMessage/InlineMessage'
import language from '../../../../language'
import theme from '../../../../theme'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'

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
  max-width: ${theme.spacing.maxWidth};
  ${hoverState(css`
    background: ${theme.color.tableRowHover};
  `)}
`

const ScrollToButton = styled(ButtonThatLooksLikeLink)`
  text-decoration: underline;
  white-space: nowrap;
  padding: ${theme.spacing.small};
  font-size: smaller;
`

const checkScrollToObservation = (validationInfo) => {
  const validationStatusNotOkay = validationInfo.status !== 'ok'
  const observationTableValidationMessages = [
    'data.obs_colonies_bleached',
    'data.obs_benthic_photo_quadrats',
    'data.obs_belt_fishes',
  ].some((obs) => validationInfo?.fields?.includes(obs))

  return validationStatusNotOkay && observationTableValidationMessages
}

const RecordLevelValidationInfo = ({
  areValidationsShowing,
  ignoreRecordLevelValidation,
  resetRecordLevelValidation,
  validations,
  handleScrollToObservation,
}) => {
  const { projectId } = useParams()
  const handleIgnoreWarningChange = async ({ event, validationId }) => {
    const isIgnoreChecked = event.target.checked

    if (isIgnoreChecked) {
      ignoreRecordLevelValidation({ validationId })
    }
    if (!isIgnoreChecked) {
      resetRecordLevelValidation({ validationId })
    }
  }

  const hasUnresolvedErrors = validations.some(
    (validation) => validation.code !== 'unsuccessful_dry_submit' && validation.status === 'error',
  )

  const filteredValidations = validations.filter((validation) => {
    if (validation.code === 'unsuccessful_dry_submit') {
      // Show dry submit errors only if there are no unresolved errors
      return !hasUnresolvedErrors
    }

    return true
  })

  return (
    <ValidationList data-testid="record-level-validations">
      {filteredValidations.map((validation) => {
        const { status, validation_id } = validation
        const isWarning = status === 'warning'
        const isError = status === 'error'
        const isIgnored = status === 'ignore'
        const isReset = status === 'reset'
        const statusForStyling = isReset ? 'warning' : status

        const validationMessage = language.getValidationMessage(validation, projectId)
        const isScrollToViewAvailable = checkScrollToObservation(validation)

        return (isError || isWarning || isIgnored || isReset) && areValidationsShowing ? (
          <InlineValidationItem key={validation_id}>
            <InlineMessage type={statusForStyling}>
              <p>{validationMessage}</p>
            </InlineMessage>
            {isScrollToViewAvailable && (
              <ScrollToButton onClick={handleScrollToObservation}>
                Scroll to observations
              </ScrollToButton>
            )}
            {isWarning || isReset || isIgnored ? (
              <InputIgnoreValidationWarningCheckboxWithLabel
                onChange={(event) => {
                  handleIgnoreWarningChange({ event, validationId: validation.validation_id })
                }}
                checked={isIgnored}
              />
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
  handleScrollToObservation: PropTypes.func.isRequired,
}

export default RecordLevelValidationInfo
