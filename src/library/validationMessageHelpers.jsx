import React from 'react'
import { styled } from 'styled-components'

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

const getDuplicateIndexes = (duplicateIndexes) => {
  const indexList = duplicateIndexes.flatMap((array) => array.map((item) => item.index + 1))

  return indexList.join(', ')
}

const getObservationFieldName = (fieldName) => {
  // fieldName is a string 'data.obs_colonies_bleached' as an example
  // since the api does not give us the name, 'Colonies Bleached', we have to map this ourselves and also remove 'data.' from the field name

  const cleanFieldName = fieldName.slice(5)

  const observationFieldNameMapping = {
    obs_colonies_bleached: 'colonies bleached',
    benthic_photo_quadrats: 'Benthic Photo Quadrats',
  }

  return observationFieldNameMapping[cleanFieldName]
    ? observationFieldNameMapping[cleanFieldName]
    : ''
}

export const getDuplicateValuesValidationMessage = (field, context) => {
  return `Duplicate ${getObservationFieldName(field)} observations: ${getDuplicateIndexes(context)}`
}

export const getInvalidBleachingObsMessage = (context, obsType) => {
  const observationCountPaths = {
    count_normal: 'normal',
    count_pale: 'pale',
    count_20: '0-20%',
    count_50: '20-50%',
    count_80: '50-80%',
    count_100: '80-100',
    count_dead: 'dead',
  }
  const observationPercentPaths = {
    percent_hard: 'hard coral',
    percent_soft: 'soft coral',
    percent_algae: 'macroalgae',
  }
  const obsPaths = obsType === 'percent cover' ? observationPercentPaths : observationCountPaths
  const invalidValues = (context?.invalid_paths || []).map((key) => obsPaths[key])
  const invalidValuesString = invalidValues.join(', ')

  return `Each ${obsType} must be a positive number, and not blank. Invalid values: ${invalidValuesString}`
}

export const getInvalidBleachingObsTotalMessage = (context) => {
  return `Sum of values must not be less than ${context?.value_range[0]} or greater than ${context?.value_range[1]}`
}

export const getObservationsCountMessage = (fields, compWord, compVal) => {
  const obsField = fields[0]
  const tableStringMap = {
    'data.obs_quadrat_benthic_percent': ' in Percent Cover',
    'data.obs_colonies_bleached': ' in Colonies Bleached',
  }
  const inObsTableString = tableStringMap[obsField] || ''

  return `${compWord} than ${compVal} observations${inObsTableString}`
}
