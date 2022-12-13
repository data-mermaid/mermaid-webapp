import PropTypes from 'prop-types'
import React from 'react'

import {
  managementRegimePropType,
  sitePropType,
  benthicPhotoQuadratPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
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
  collectRecord,
  formik,
  managementRegimes,
  sites,
  handleSitesChange,
  handleChangeForDirtyIgnoredInput,
  ignoreNonObservationFieldValidations,
  resetNonObservationFieldValidations,
  validationPropertiesWithDirtyResetOnInputChange,
}) => {
  const managementSelectOptions = getOptions(managementRegimes, false)
  const siteSelectOptions = getOptions(sites, false)
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
    handleChangeForDirtyIgnoredInput({
      inputName: 'site',
      validationProperties: siteValidationProperties,
      validationPath: SITE_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }

  const handleManagementChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'management',
      validationProperties: managementValidationProperties,
      validationPath: MANAGEMENT_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }

  const handleSampleDateChange = (event) => {
    handleChangeForDirtyIgnoredInput({
      inputName: 'sample_date',
      validationProperties: sampleDateValidationProperties,
      validationPath: SAMPLE_DATE_VALIDATION_PATH,
    })
    formik.handleChange(event)
  }

  const updateValueAndResetValidationForSite = (siteValue, siteOptions) => {
    formik.setFieldValue('site', siteValue)
    handleSitesChange(siteOptions)
    resetNonObservationFieldValidations({ validationPath: SITE_VALIDATION_PATH })
  }
  const updateValueAndResetValidationForMR = (managementRegimeValue, managementRegimeOptions) => {
    formik.setFieldValue('management', managementRegimeValue)
    handleSitesChange(managementRegimeOptions)
    resetNonObservationFieldValidations({ validationPath: MANAGEMENT_VALIDATION_PATH })
  }

  return (
    <>
      <InputWrapper>
        <H2>Sample Event</H2>
        <InputSelectWithLabelAndValidation
          label="Site"
          required={true}
          id="site"
          testId="site"
          options={siteSelectOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SITE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SITE_VALIDATION_PATH })
          }}
          {...siteValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(siteValidationProperties, 'site')}
          onBlur={formik.handleBlur}
          value={formik.values.site}
          onChange={handleSiteChange}
          updateValueAndResetValidationForDuplicateWarning={updateValueAndResetValidationForSite}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          required={true}
          id="management"
          testId="management"
          options={managementSelectOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: MANAGEMENT_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: MANAGEMENT_VALIDATION_PATH })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(
            managementValidationProperties,
            'management',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.management}
          onChange={handleManagementChange}
          updateValueAndResetValidationForDuplicateWarning={updateValueAndResetValidationForMR}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
          required={true}
          id="sample_date"
          testId="sample_date"
          type="date"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SAMPLE_DATE_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SAMPLE_DATE_VALIDATION_PATH })
          }}
          {...sampleDateValidationProperties}
          {...validationPropertiesWithDirtyResetOnInputChange(
            sampleDateValidationProperties,
            'sample_date',
          )}
          onBlur={formik.handleBlur}
          value={formik.values.sample_date}
          onChange={handleSampleDateChange}
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
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  handleSitesChange: PropTypes.func.isRequired,
  handleChangeForDirtyIgnoredInput: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

SampleEventInputs.defaultProps = {
  collectRecord: undefined,
}

export default SampleEventInputs
