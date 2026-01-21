import React from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import i18n from '../../i18n'

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
      values={{ method: duplicateTransectMethodContext }}
      components={{ a: <a href={linkToSampleUnit} /> }}
    />
  )
}

export const goToManagementOverviewPageLink = (projectId) => {
  const linkToMROverviewPage = `/projects/${projectId}/management-regimes-overview`

  return (
    <Trans
      i18nKey="go_to_management_overview_page"
      components={{
        a: <a href={linkToMROverviewPage} />,
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

  const observationFieldNameMapping = {
    obs_colonies_bleached: i18n.t('colonies_bleached'),
    benthic_photo_quadrats: i18n.t('benthic_photo_quadrats'),
  }

  return observationFieldNameMapping[cleanFieldName]
    ? observationFieldNameMapping[cleanFieldName]
    : ''
}

export const getDuplicateValuesValidationMessage = (field, duplicates) => {
  return i18n.t('validation_messages.duplicate_values', {
    fieldName: getObservationFieldName(field),
    indexes: getDuplicateIndexes(duplicates),
  })
}

export const getInvalidBleachingObsMessage = (context, obsTypeKey) => {
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
  const obsPaths = obsTypeKey === 'percent_cover' ? observationPercentPaths : observationCountPaths
  const invalidValues = (context?.invalid_paths || []).map((key) => obsPaths[key]).filter(Boolean)
  const invalidValuesString = invalidValues.join(', ')
  const obsType = i18n.t(obsTypeKey)

  return i18n.t('validation_messages.invalid_bleaching_observation', {
    obsType,
    invalidValues: invalidValuesString,
  })
}

export const getInvalidBleachingObsTotalMessage = (context) => {
  const min = context?.value_range?.[0] ?? ''
  const max = context?.value_range?.[1] ?? ''

  return i18n.t('validation_messages.invalid_total', { min, max })
}

export const getObservationsCountMessage = (fields, comparisonKey, comparisonValue) => {
  const observationTableSuffixTokens = {
    'data.obs_quadrat_benthic_percent': i18n.t('percent_cover'),
    'data.obs_colonies_bleached': i18n.t('colonies_bleached'),
  }

  const obsField = fields?.[0] ?? ''
  const suffixToken = observationTableSuffixTokens[obsField]

  return i18n.t('validation_messages.observation_count', {
    comparison: i18n.t(`measurements.${comparisonKey}`),
    count: comparisonValue ?? '',
    suffixToken,
  })
}

export const getValidationMessage = (validation, projectId = '') => {
  const { code, context, fields, name } = validation

  const validationMessages = {
    all_attributes_same_category: () =>
      i18n.t('validation_messages.all_attributes_same_category', {
        category: context?.category ?? '',
      }),
    all_equal: () => i18n.t('validation_messages.all_equal'),
    diff_num_images: () => i18n.t('validation_messages.diff_num_images'),
    diff_num_quadrats: () => i18n.t('validation_messages.diff_num_quadrats'),
    different_num_points_per_quadrat_se: () =>
      i18n.t('validation_messages.different_num_points_per_quadrat_se'),
    different_num_quadrats_se: () => i18n.t('validation_messages.different_num_quadrats_se'),
    different_transect_length_se: () => i18n.t('validation_messages.different_transect_length_se'),
    different_transect_width_se: () => i18n.t('validation_messages.different_transect_width_se'),
    different_quadrat_size_se: () => i18n.t('validation_messages.different_quadrat_size_se'),
    duplicate_benthic_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_fishbelt_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_quadrat_collection: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_quadrat_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_transect: () => i18n.t('validation_messages.duplicate_transect'),
    duplicate_values: () =>
      fields?.length
        ? getDuplicateValuesValidationMessage(fields[0], context?.duplicates)
        : i18n.t('validation_messages.duplicate_generic'),
    invalid_count: () => getInvalidBleachingObsMessage(context, 'colony_count'),
    invalid_intervals: () => i18n.t('validation_messages.invalid_intervals'),
    invalid_percent_value: () => getInvalidBleachingObsMessage(context, 'percent_cover'),
    invalid_total: () => getInvalidBleachingObsTotalMessage(context),
    exceed_total_colonies: () => i18n.t('validation_messages.exceed_total_colonies'),
    implausibly_old_date: () => i18n.t('validation_messages.implausibly_old_date'),
    future_sample_date: () => i18n.t('validation_messages.future_sample_date'),
    high_density: () =>
      i18n.t('validation_messages.high_density', {
        max: context?.biomass_range?.[1] ?? '',
      }),
    incorrect_observation_count: () =>
      i18n.t('validation_messages.incorrect_observation_count', {
        expectedCount: context?.expected_count ?? '',
      }),
    invalid_interval_size: () => i18n.t('validation_messages.invalid_interval_size'),
    max_interval_size: () =>
      i18n.t('validation_messages.max_interval_size', {
        max: context?.interval_size_range?.[1] ?? '',
      }),
    max_interval_start: () =>
      i18n.t('validation_messages.max_interval_start', {
        max: context?.interval_start_range?.[1] ?? '',
      }),
    invalid_benthic_transect: () => i18n.t('validation_messages.invalid_benthic_transect'),
    invalid_depth: () =>
      i18n.t('validation_messages.invalid_depth', {
        min: context?.depth_range?.[0] ?? '',
      }),
    excessive_precision: () =>
      i18n.t('validation_messages.excessive_precision', {
        count: context?.decimal_places ?? '',
      }),
    invalid_fish_count: () => i18n.t('validation_messages.invalid_fish_count'),
    invalid_fish_size: () => i18n.t('validation_messages.invalid_fish_size'),
    invalid_fishbelt_transect: () => i18n.t('validation_messages.invalid_fishbelt_transect'),
    invalid_number_of_points: () =>
      i18n.t('validation_messages.invalid_number_of_points', {
        invalidQuadratNumbers: context?.invalid_quadrat_numbers ?? '',
      }),
    invalid_quadrat_collection: () => i18n.t('validation_messages.invalid_quadrat_collection'),
    invalid_quadrat_size: () => i18n.t('validation_messages.invalid_quadrat_size'),
    max_quadrat_size: () =>
      i18n.t('validation_messages.max_quadrat_size', {
        max: context?.quadrat_size_range?.[1] ?? '',
      }),
    invalid_quadrat_transect: () => i18n.t('validation_messages.invalid_quadrat_transect'),
    invalid_sample_date: () => i18n.t('validation_messages.invalid_sample_date'),
    invalid_score: () => i18n.t('validation_messages.invalid_score'),
    large_num_quadrats: () => i18n.t('validation_messages.large_num_quadrats'),
    len_surveyed_not_positive: () => i18n.t('validation_messages.len_surveyed_not_positive'),
    len_surveyed_out_of_range: () =>
      i18n.t('validation_messages.len_surveyed_out_of_range', {
        min: context?.len_surveyed_range?.[0] ?? '',
        max: context?.len_surveyed_range?.[1] ?? '',
      }),
    low_density: () =>
      i18n.t('validation_messages.low_density', {
        min: context?.biomass_range?.[0] ?? '',
      }),
    management_not_found: () => i18n.t('validation_messages.management_not_found'),
    max_depth: () =>
      i18n.t('validation_messages.max_depth', {
        max: context?.depth_range?.[1] ?? '',
      }),
    max_fish_size: () => i18n.t('validation_messages.max_fish_size'),
    minimum_total_fish_count: () =>
      i18n.t('validation_messages.minimum_total_fish_count', {
        minimumFishCount: context?.minimum_fish_count ?? '',
      }),
    missing_quadrat_numbers: () =>
      i18n.t('validation_messages.missing_quadrat_numbers', {
        numbers: context?.missing_quadrat_numbers ?? '',
      }),
    missing_intervals: () =>
      i18n.t('validation_messages.missing_intervals', {
        intervals: context?.missing_intervals ?? '',
      }),
    no_region_match: () => i18n.t('validation_messages.no_region_match'),
    not_part_of_fish_family_subset: () =>
      i18n.t('validation_messages.not_part_of_fish_family_subset'),
    not_positive_integer: () => i18n.t('validation_messages.not_positive_integer'),
    not_unique_site: () => i18n.t('validation_messages.not_unique_site'),
    not_unique_management: () => goToManagementOverviewPageLink(projectId),
    obs_total_length_toolarge: () =>
      i18n.t('validation_messages.obs_total_length_toolarge', {
        totalLength: context?.total_obs_length ?? '',
        transectLength: context?.len_surveyed ?? '',
      }),
    obs_total_length_toosmall: () =>
      i18n.t('validation_messages.obs_total_length_toosmall', {
        totalLength: context?.total_obs_length ?? '',
        transectLength: context?.len_surveyed ?? '',
      }),
    required: () => i18n.t('validation_messages.required'),
    required_management_rules: () => i18n.t('validation_messages.required_management_rules'),
    sample_time_out_of_range: () =>
      i18n.t('validation_messages.sample_time_out_of_range', {
        start: context?.time_range?.[0] ?? '',
        end: context?.time_range?.[1] ?? '',
      }),
    similar_name: () => i18n.t('validation_messages.similar_name'),
    similar_date_sample_unit: () => i18n.t('validation_messages.similar_date_sample_unit'),
    site_not_found: () => i18n.t('validation_messages.site_not_found'),
    too_many_observations: () =>
      getObservationsCountMessage(fields, 'greater', context?.observation_count_range?.[1]),
    too_few_observations: () =>
      getObservationsCountMessage(fields, 'fewer', context?.observation_count_range?.[0]),
    unknown_protocol: () => i18n.t('validation_messages.unknown_protocol'),
    unsuccessful_dry_submit: () => getSystemValidationErrorMessage(context?.dry_submit_results),
    value_not_set: () => i18n.t('validation_messages.value_not_set'),
    default: () => code || name,
    unconfirmed_annotation: () => i18n.t('validation_messages.unconfirmed_annotation'),
  }

  return (validationMessages[code] || validationMessages.default)()
}
