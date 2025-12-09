import { useParams } from 'react-router-dom'
import React from 'react'
import styled, { css } from 'styled-components'

import { ButtonThatLooksLikeLink } from '../../../generic/buttons'
import { hoverState } from '../../../../library/styling/mediaQueries'
import { ValidationList } from '../../../generic/form'
import { MessageType } from '../../../../types/constants'
import InlineMessage from '../../../generic/InlineMessage'
import language from '../../../../language'
import theme from '../../../../theme'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'
import DuplicateImageValidationContent, { Image } from './DuplicateImageValidationContent'

interface RecordValidationInfo {
  status: 'ok' | 'warning' | 'error' | 'ignore' | 'reset'
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
  handleScrollToObservation: () => void
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

const checkScrollToObservation = (validationInfo: RecordValidationInfo): boolean => {
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
}: RecordLevelValidationInfoProps) => {
  const { projectId, recordId } = useParams()
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
        const { status, validation_id, code, context } = validation
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
            <p>{language.getValidationMessage(validation, projectId)}</p>
          )
        const isScrollToViewAvailable = checkScrollToObservation(validation)

        return (isError || isWarning || isIgnored || isReset) && areValidationsShowing ? (
          <InlineValidationItem key={validation_id}>
            <InlineMessage type={statusForStyling as MessageType}>
              {validationMessage}
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

export default RecordLevelValidationInfo
