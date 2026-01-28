import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { IconAlert } from '../../../icons'
import { getValidationMessage } from '../../../../library/validationMessageHelpers'
import theme from '../../../../theme'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'

interface RecordValidationInfo {
  status: 'ok' | 'warning' | 'error' | 'ignore' | 'reset'
  validation_id: string
  code: string
  fields?: string[]
  context?: Record<string, unknown>
  [key: string]: unknown
}

interface ObservationLevelValidationInfoProps {
  areValidationsShowing: boolean
  ignoreRecordLevelValidation: (args: { validationId: string }) => void
  resetRecordLevelValidation: (args: { validationId: string }) => void
  validations: RecordValidationInfo[]
}

const ValidationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  max-width: ${theme.spacing.maxWidth};
  margin: ${theme.spacing.medium} 0;
`

const ValidationTableRow = styled.tr`
  border-bottom: 1px solid ${theme.color.border};

  &:last-child {
    border-bottom: none;
  }
`

const ValidationTableCell = styled.td`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  vertical-align: middle;

  &:first-child {
    width: 30px;
  }

  &:last-child {
    text-align: right;
    width: auto;
  }
`

const IconCell = styled(ValidationTableCell)`
  text-align: center;
  color: ${({ $status }: { $status: string }) => {
    if ($status === 'error') return theme.color.cautionColor
    if ($status === 'warning' || $status === 'reset') return theme.color.warningColor
    return theme.color.textColor
  }};
`

const MessageCell = styled(ValidationTableCell)`
  flex: 1;

  p {
    margin: 0;
    font-size: inherit;
  }
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

const ObservationLevelValidationInfo = ({
  areValidationsShowing,
  ignoreRecordLevelValidation,
  resetRecordLevelValidation,
  validations,
}: ObservationLevelValidationInfoProps) => {
  const { projectId } = useParams()

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

  // Filter to only observation-related validations
  const observationValidations = validations.filter((validation) =>
    checkScrollToObservation(validation),
  )

  if (!observationValidations.length || !areValidationsShowing) {
    return null
  }

  return (
    <ValidationTable data-testid="observation-level-validations">
      <tbody>
        {observationValidations.map((validation) => {
          const { status, validation_id } = validation
          const isWarning = status === 'warning'
          const isError = status === 'error'
          const isIgnored = status === 'ignore'
          const isReset = status === 'reset'

          const validationMessage = getValidationMessage(validation, projectId)

          return isError || isWarning || isIgnored || isReset ? (
            <ValidationTableRow key={validation_id}>
              <IconCell $status={status}>
                <IconAlert />
              </IconCell>
              <MessageCell>
                <p>{validationMessage}</p>
              </MessageCell>
              {isWarning || isReset || isIgnored ? (
                <ValidationTableCell>
                  <InputIgnoreValidationWarningCheckboxWithLabel
                    onChange={(event) => {
                      handleIgnoreWarningChange({ event, validationId: validation.validation_id })
                    }}
                    checked={isIgnored}
                  />
                </ValidationTableCell>
              ) : (
                <ValidationTableCell />
              )}
            </ValidationTableRow>
          ) : null
        })}
      </tbody>
    </ValidationTable>
  )
}

export default ObservationLevelValidationInfo
