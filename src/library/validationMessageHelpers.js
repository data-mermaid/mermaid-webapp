import React from 'react'
import styled from 'styled-components/macro'

const duplicateWarningCodes = ['not_unique_site', 'not_unique_management']

const SystemValidationMessageBlock = styled.span`
  display: block;
`

export const getSystemValidationErrorMessage = (drySubmitContext) => {
  const errors = Object.entries(drySubmitContext)
  const errorMap = errors.map((errorPart) => (
    <SystemValidationMessageBlock key={errorPart[0]}>
      {errorPart[0]}: {errorPart[1]}
    </SystemValidationMessageBlock>
  ))

  return (
    <>
      <SystemValidationMessageBlock>System validation error: </SystemValidationMessageBlock>
      <SystemValidationMessageBlock>{errorMap}</SystemValidationMessageBlock>
    </>
  )
}

export const getDuplicateSampleUnitLink = (duplicateTransectMethodContext, projectId) => {
  const linkToSampleUnit = `/projects/${projectId}/submitted/fishbelt/${duplicateTransectMethodContext}`

  return (
    <span>
      Duplicate sample unit <a href={linkToSampleUnit}>{duplicateTransectMethodContext}</a>
    </span>
  )
}

export const checkDuplicateWarningInValidationMessages = (validationMessages) => {
  for (const message of validationMessages) {
    if (duplicateWarningCodes.includes(message.code)) {
      return true
    }
  }

  return false
}
