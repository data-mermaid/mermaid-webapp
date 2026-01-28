import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { IconCloseCircle } from '../../../icons'
import { getValidationMessage } from '../../../../library/validationMessageHelpers'
import theme from '../../../../theme'

interface RecordValidationInfo {
  status: 'ok' | 'warning' | 'error' | 'ignore' | 'reset'
  validation_id: string
  code: string
  fields?: string[]
  context?: Record<string, unknown>
  [key: string]: unknown
}

interface ErrorValidationInfoProps {
  areValidationsShowing: boolean
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
`

const IconCell = styled(ValidationTableCell)`
  text-align: center;
  color: ${theme.color.cautionColor};
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

const ErrorValidationInfo = ({ areValidationsShowing, validations }: ErrorValidationInfoProps) => {
  const { projectId } = useParams()

  // Filter to only error-level validations that are not observation-related
  const errorValidations = validations.filter(
    (validation) => validation.status === 'error' && !checkScrollToObservation(validation),
  )

  if (!errorValidations.length || !areValidationsShowing) {
    return null
  }

  return (
    <ValidationTable data-testid="error-level-validations">
      <tbody>
        {errorValidations.map((validation) => {
          const { validation_id } = validation
          const validationMessage = getValidationMessage(validation, projectId)

          return (
            <ValidationTableRow key={validation_id}>
              <IconCell>
                <IconCloseCircle />
              </IconCell>
              <MessageCell>
                <p>{validationMessage}</p>
              </MessageCell>
            </ValidationTableRow>
          )
        })}
      </tbody>
    </ValidationTable>
  )
}

export default ErrorValidationInfo
