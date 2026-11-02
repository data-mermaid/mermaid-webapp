import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  managementRegimePropType,
  sitePropType,
  benthicPhotoQuadratPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formik/formikPropType'
import { getManagementRegimeOptions, getOptions } from '../../../../library/getOptions'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import { H2 } from '../../../generic/text'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import { InputWrapper } from '../../../generic/form'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'

const MANAGEMENT_VALIDATION_PATH = 'data.sample_event.management'
const SAMPLE_DATE_VALIDATION_PATH = 'data.sample_event.sample_date'
const SITE_VALIDATION_PATH = 'data.sample_event.site'

const SampleEventInputs = ({
  areValidationsShowing,
  collectRecord = undefined,
  formik,
  managementRegimes,
  handleManagementRegimesChange,
  sites,
  handleSitesChange,
  ignoreNonObservationFieldValidations,
  markFieldValidationsStale,
  unignoreNonObservationFieldValidations,
}) => {
  const { t } = useTranslation()
  const managementRegimeOptions = getManagementRegimeOptions(managementRegimes)
  const siteOptions = getOptions(sites)
  const validationsApiData = collectRecord?.validations?.results?.data
  const sample_event = validationsApiData?.sample_event

  const siteValidationProperties = getValidationPropertiesForInput(
    sample_event?.site,
    areValidationsShowing,
  )

  const managementValidationProperties = getValidationPropertiesForInput(
    sample_event?.management,
    areValidationsShowing,
  )

  const sampleDateValidationProperties = getValidationPropertiesForInput(
    sample_event?.sample_date,
    areValidationsShowing,
  )

  const handleSiteChange = (event) => {
    markFieldValidationsStale({
      validationPath: SITE_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }

  const handleManagementChange = (event) => {
    markFieldValidationsStale({
      validationPath: MANAGEMENT_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }

  const handleSampleDateChange = (event) => {
    markFieldValidationsStale({
      validationPath: SAMPLE_DATE_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }

  const updateValueAndResetValidationForSite = (value, options) => {
    formik.setFieldValue('site', value)
    handleSitesChange(options)
    markFieldValidationsStale({ validationPath: SITE_VALIDATION_PATH })
  }

  const updateValueAndResetValidationForMR = (value, options) => {
    formik.setFieldValue('management', value)
    handleManagementRegimesChange(options)
    markFieldValidationsStale({ validationPath: MANAGEMENT_VALIDATION_PATH })
  }

  return (
    <>
      <InputWrapper>
        <H2>{t('sample_units.sample_event')}</H2>
        <InputSelectWithLabelAndValidation
          label={t('sites.site')}
          required={true}
          id="site"
          testId="site"
          options={siteOptions}
          validationPath={SITE_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...siteValidationProperties}
          {...siteValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.site}
          onChange={handleSiteChange}
          updateValueAndResetValidationForDuplicateWarning={updateValueAndResetValidationForSite}
          helperText={t('sites.site_info')}
          displayViewLink={true}
        />
        <InputSelectWithLabelAndValidation
          label={t('management_regimes.management')}
          required={true}
          id="management"
          testId="management"
          options={managementRegimeOptions}
          validationPath={MANAGEMENT_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...managementValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.management}
          onChange={handleManagementChange}
          updateValueAndResetValidationForDuplicateWarning={updateValueAndResetValidationForMR}
          helperText={t('management_regimes.management_regime_info')}
          displayViewLink={true}
        />
        <InputWithLabelAndValidation
          label={t('sample_units.sample_date')}
          required={true}
          id="sample_date"
          testId="sample-date"
          type="date"
          validationPath={SAMPLE_DATE_VALIDATION_PATH}
          ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
          unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
          {...sampleDateValidationProperties}
          {...sampleDateValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.sample_date}
          onChange={handleSampleDateChange}
          helperText={t('sample_units.sample_date_info')}
        />
      </InputWrapper>
    </>
  )
}

SampleEventInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  formik: formikPropType.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  handleManagementRegimesChange: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  handleSitesChange: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  markFieldValidationsStale: PropTypes.func.isRequired,
  unignoreNonObservationFieldValidations: PropTypes.func.isRequired,
}

export default SampleEventInputs
