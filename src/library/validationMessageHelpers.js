import React from 'react'
import styled from 'styled-components/macro'

const SystemValidationMessageBlock = styled.span`
  display: block;
`

export const getSystemValidationErrorMessage = (drySubmitContext) => {
  const errors = Object.entries(drySubmitContext)

  const errorMap = errors.map((errorPart) => (
    <SystemValidationMessageBlock key={errorPart[0]}>
      {errorPart[0]} : {errorPart[1]}
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

export const goToManagementOverviewPageLink = (projectId) => {
  const linkToMROverviewPage = `/projects/${projectId}/management-regimes-overview`

  return (
    <span>
      {' '}
      Other sample events at this site have a different management regime. Go to{' '}
      <a href={linkToMROverviewPage}>Management Regime Overview</a>.
    </span>
  )
}
