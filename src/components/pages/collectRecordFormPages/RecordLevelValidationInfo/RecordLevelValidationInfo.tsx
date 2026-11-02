import { useParams } from 'react-router'
import React from 'react'
import { styled, css } from 'styled-components'

import { hoverState } from '../../../../library/styling/mediaQueries'
import { ValidationList } from '../../../generic/form'
import { MessageType, ValidationStatus } from '../../../../types/constants'
import InlineMessage from '../../../generic/InlineMessage'
import { getValidationMessage } from '../../../../library/validationMessageHelpers'
import theme from '../../../../theme'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'
import DuplicateImageValidationContent, { Image } from './DuplicateImageValidationContent'

interface RecordValidationInfo {
  status: ValidationStatus
  validation_id: string
  code: string
  fields?: string[]
  context?: Record<string, unknown>
  [key: string]: unknown
}

export interface RecordLevelValidationInfoProps {
  areValidationsShowing: boolean
  ignoreRecordLevelValidation: (args: { validationId: string }) => void
  unignoreRecordLevelValidation: (args: { validationId: string }) => void
  validations: RecordValidationInfo[]
  testId?: string
}

const InlineValidationItem = styled.li`
  max-width: ${theme.spacing.maxWidth};
  ${hoverState(css`
    background: ${theme.color.tableRowHover};
  `)}
`

const RecordLevelValidationInfo = ({
  areValidationsShowing,
  ignoreRecordLevelValidation,
  unignoreRecordLevelValidation,
  validations,
  testId = 'record-level-validations',
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
      unignoreRecordLevelValidation({ validationId })
    }
  }

  return (
    <ValidationList data-testid={testId}>
      {validations.map((validation) => {
        const { status, validation_id, code, context } = validation
        const isWarning = status === 'warning'
        const isError = status === 'error'
        const isIgnored = status === 'ignore'

        const validationMessage =
          code === 'duplicate_images' ? (
            <DuplicateImageValidationContent
              duplicates={(context?.duplicates ?? {}) as Record<string, Image[]>}
              imgId={recordId ?? ''}
            />
          ) : (
            <p>{getValidationMessage(validation, projectId)}</p>
          )

        return (isError || isWarning || isIgnored) && areValidationsShowing ? (
          <InlineValidationItem key={validation_id} data-record-validation-id={validation_id}>
            <InlineMessage type={status as MessageType}>{validationMessage}</InlineMessage>
            {isWarning || isIgnored ? (
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
