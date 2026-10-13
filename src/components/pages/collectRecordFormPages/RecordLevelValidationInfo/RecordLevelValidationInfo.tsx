import { useParams } from 'react-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { styled, css } from 'styled-components'

import { ButtonThatLooksLikeLink } from '../../../generic/buttons'
import { hoverState } from '../../../../library/styling/mediaQueries'
import { ValidationList } from '../../../generic/form'
import { MessageType, ValidationStatus } from '../../../../types/constants'
import InlineMessage from '../../../generic/InlineMessage'
import { getValidationMessage } from '../../../../library/validationMessageHelpers'
import theme from '../../../../theme'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'
import DuplicateImageValidationContent, { Image } from './DuplicateImageValidationContent'
import getRecordLevelValidationsToDisplay from '../getRecordLevelValidationsToDisplay'

interface RecordValidationInfo {
  status: ValidationStatus
  validation_id: string
  code: string
  fields?: string[]
  context?: Record<string, unknown>
  [key: string]: unknown
}

interface RecordLevelValidationInfoProps {
  areValidationsShowing: boolean
  ignoreRecordLevelValidation: (args: { validationId: string }) => void
  resetRecordLevelValidation: (args: { validationId: string }) => void
  validations: RecordValidationInfo[]
  handleScrollToObservation: (fields?: string[]) => void
}

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

// A record-level validation gets a "scroll to observations" link when it points at an
// observation table. The API names those tables in `fields` with a `data.obs_` prefix, one
// per protocol (`data.obs_benthic_lits`, `data.obs_belt_fishes`). Matching the prefix covers
// every protocol, including any added later, without editing this file. The trailing
// underscore matters: it stops `data.observers`, a form field, from matching.
const OBSERVATION_FIELD_PREFIX = 'data.obs_'

const checkScrollToObservation = ({ status, fields }: RecordValidationInfo): boolean =>
  status !== 'ok' && (fields ?? []).some((field) => field.startsWith(OBSERVATION_FIELD_PREFIX))

const RecordLevelValidationInfo = ({
  areValidationsShowing,
  ignoreRecordLevelValidation,
  resetRecordLevelValidation,
  validations,
  handleScrollToObservation,
}: RecordLevelValidationInfoProps) => {
  const { projectId, recordId } = useParams()
  const { t } = useTranslation()
  const handleIgnoreWarningChange = async (args: {
    event: React.ChangeEvent<HTMLInputElement>
    validationId: string
  }): Promise<void> => {
    const { event, validationId } = args
    const isIgnoreChecked = event.target.checked

    if (isIgnoreChecked) {
      ignoreRecordLevelValidation({ validationId })
    }
    if (!isIgnoreChecked) {
      resetRecordLevelValidation({ validationId })
    }
  }

  const filteredValidations = getRecordLevelValidationsToDisplay(validations)

  return (
    <ValidationList data-testid="record-level-validations">
      {filteredValidations.map((validation) => {
        const { status, validation_id, code, context, fields } = validation
        const isWarning = status === 'warning'
        const isError = status === 'error'
        const isIgnored = status === 'ignore'
        const isReset = status === 'reset'
        const statusForStyling = isReset ? 'warning' : status

        const validationMessage =
          code === 'duplicate_images' ? (
            <DuplicateImageValidationContent
              duplicates={(context?.duplicates ?? {}) as Record<string, Image[]>}
              imgId={recordId ?? ''}
            />
          ) : (
            <p>{getValidationMessage(validation, projectId)}</p>
          )
        const isScrollToViewAvailable = checkScrollToObservation(validation)

        return (isError || isWarning || isIgnored || isReset) && areValidationsShowing ? (
          <InlineValidationItem key={validation_id} data-record-validation-id={validation_id}>
            <InlineMessage type={statusForStyling as MessageType}>
              {validationMessage}
            </InlineMessage>
            {isScrollToViewAvailable && (
              <ScrollToButton onClick={() => handleScrollToObservation(fields)}>
                {t('sample_units.scroll_to_observations')}
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

export default RecordLevelValidationInfo
