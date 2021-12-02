import React from 'react'
import PropTypes from 'prop-types'

import {
  choicesPropType,
  fishBeltPropType,
  managementRegimePropType,
  sitePropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'

const SITE_VALIDATION_PATH = 'data.sample_event.site'
const MANAGEMENT_VALIDATION_PATH = 'data.sample_event.management'
const DEPTH_VALIDATION_PATH = 'data.fishbelt_transect.depth'
const SAMPLE_DATE_VALIDATION_PATH = 'data.sample_event.sample_date'
const SAMPLE_TIME_VALIDATION_PATH = 'data.fishbelt_transect.sample_time'

const SampleInfoInputs = ({
  areValidationsShowing,
  collectRecord,
  formik,
  handleChangeForDirtyIgnoredInput,
  ignoreNonObservationFieldValidations,
  managementRegimes,
  resetNonObservationFieldValidations,
  sites,
}) => {
  const hasData = false
  const managementSelectOptions = getOptions(managementRegimes, hasData)
  const siteSelectOptions = getOptions(sites, hasData)
  const validationsApiData = collectRecord?.validations?.results?.data
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  const sample_event = validationsApiData?.sample_event

  const siteValidationProperties = getValidationPropertiesForInput(
    sample_event?.site,
    areValidationsShowing,
  )
  const managementValidationProperties = getValidationPropertiesForInput(
    sample_event?.management,
    areValidationsShowing,
  )
  const depthValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.depth,
    areValidationsShowing,
  )
  const sampleDateValidationProperties = getValidationPropertiesForInput(
    sample_event?.sample_date,
    areValidationsShowing,
  )
  const sampleTimeValidationProperties = getValidationPropertiesForInput(
    fishbelt_transect?.sample_time,
    areValidationsShowing,
  )

  const handleSiteChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'site',
      validationProperties: siteValidationProperties,
      validationPath: SITE_VALIDATION_PATH,
    })
  }

  const handleManagementChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'management',
      validationProperties: managementValidationProperties,
      validationPath: MANAGEMENT_VALIDATION_PATH,
    })
  }

  const handleDepthChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'depth',
      validationProperties: depthValidationProperties,
      validationPath: DEPTH_VALIDATION_PATH,
    })
  }

  const handleSampleDateChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'sample_date',
      validationProperties: sampleDateValidationProperties,
      validationPath: SAMPLE_DATE_VALIDATION_PATH,
    })
  }

  const handleSampleTimeChange = (event) => {
    formik.handleChange(event)
    handleChangeForDirtyIgnoredInput({
      inputName: 'sample_time',
      validationProperties: sampleTimeValidationProperties,
      validationPath: SAMPLE_TIME_VALIDATION_PATH,
    })
  }

  return (
    <>
      <InputWrapper>
        <H2>Sample Info</H2>
        <InputSelectWithLabelAndValidation
          label="Site"
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
          onBlur={formik.handleBlur}
          value={formik.values.site}
          onChange={handleSiteChange}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          id="management"
          testId="management"
          options={managementSelectOptions}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: MANAGEMENT_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: MANAGEMENT_VALIDATION_PATH })
          }}
          {...managementValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.management}
          onChange={handleManagementChange}
        />
        <InputWithLabelAndValidation
          label="Depth"
          id="depth"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: DEPTH_VALIDATION_PATH })
          }}
          testId="depth"
          type="number"
          {...depthValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.depth}
          onChange={handleDepthChange}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
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
          onBlur={formik.handleBlur}
          value={formik.values.sample_date}
          onChange={handleSampleDateChange}
        />
        <InputWithLabelAndValidation
          label="Sample Time"
          id="sample_time"
          testId="sample_time"
          type="time"
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath: SAMPLE_TIME_VALIDATION_PATH })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath: SAMPLE_TIME_VALIDATION_PATH })
          }}
          {...sampleTimeValidationProperties}
          onBlur={formik.handleBlur}
          value={formik.values.sample_time}
          onChange={handleSampleTimeChange}
        />
      </InputWrapper>
    </>
  )
}

SampleInfoInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  choices: choicesPropType.isRequired,
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  handleChangeForDirtyIgnoredInput: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

SampleInfoInputs.defaultProps = {
  collectRecord: undefined,
}

export default SampleInfoInputs
