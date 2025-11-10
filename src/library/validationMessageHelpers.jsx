import React from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import i18n from 'i18next'

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
      <SystemValidationMessageBlock>
        {i18n.t('validation_messages.system_validation_error')}
      </SystemValidationMessageBlock>
      <SystemValidationMessageBlock>{errorMap}</SystemValidationMessageBlock>
    </>
  )
}

export const getDuplicateSampleUnitLink = (duplicateTransectMethodContext, projectId) => {
  const linkToSampleUnit = `/projects/${projectId}/submitted/fishbelt/${duplicateTransectMethodContext}`

  return (
    <Trans
      i18nKey="validation_messages.duplicate_sample_unit"
      values={{ id: duplicateTransectMethodContext }}
      components={{
        a: <a href={linkToSampleUnit} />,
      }}
    />
  )
}

export const goToManagementOverviewPageLink = (projectId) => {
  const linkToMROverviewPage = `/projects/${projectId}/management-regimes-overview`

  return (
    <Trans
      i18nKey="validation_messages.not_unique_management"
      components={{
        a: <a href={linkToMROverviewPage}>Management Regime Overview</a>,
      }}
    />
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

  const fieldNameKeys = {
    obs_colonies_bleached: 'colonies_bleached',
    benthic_photo_quadrats: 'benthic_photo_quadrats',
  }

  const translationKey = fieldNameKeys[cleanFieldName]

  return translationKey ? i18n.t(`validation_messages.field_names.${translationKey}`) : ''
}

export const getDuplicateValuesValidationMessage = (field, context) => {
  const fieldName = getObservationFieldName(field)
  const indexes = getDuplicateIndexes(context)

  return i18n.t('validation_messages.duplicate_values', { fieldName, indexes })
}

export const getInvalidBleachingObsMessage = (context, obsType) => {
  const isPercentCover = obsType === 'percent cover'
  const pathKey = isPercentCover ? 'obs_percent_paths' : 'obs_count_paths'

  const invalidValues = (context?.invalid_paths || []).map((key) =>
    i18n.t(`validation_messages.${pathKey}.${key}`)
  )
  const invalidValuesString = invalidValues.join(', ')

  return i18n.t('validation_messages.invalid_count', { obsType, invalidValues: invalidValuesString })
}

export const getInvalidBleachingObsTotalMessage = (context) => {
  return i18n.t('validation_messages.invalid_total', {
    min: context?.value_range[0],
    max: context?.value_range[1],
  })
}

export const getObservationsCountMessage = (fields, compWord, compVal) => {
  const obsField = fields[0]
  const tableSuffixMap = {
    'data.obs_quadrat_benthic_percent': 'percent_cover',
    'data.obs_colonies_bleached': 'colonies_bleached',
  }
  const suffixKey = tableSuffixMap[obsField]
  const suffix = suffixKey ? i18n.t(`validation_messages.obs_table_suffixes.${suffixKey}`) : ''

  return i18n.t('validation_messages.too_many_observations', {
    comparison: compWord,
    count: compVal,
    suffix,
  })
}
