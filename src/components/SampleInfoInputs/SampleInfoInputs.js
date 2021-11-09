import React from 'react'
import PropTypes from 'prop-types'
import InputWithLabelAndValidation from '../mermaidInputs/InputWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../mermaidInputs/InputSelectWithLabelAndValidation'
import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import { formikPropType } from '../../library/formikPropType'
import {
  fishBeltPropType,
  managementRegimePropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'
import { getOptions } from '../../library/getOptions'
import getValidationPropertiesForInput from '../pages/collectRecordFormPages/getValidationPropertiesForInput'

const SampleInfoInputs = ({
  areValidationsShowing,
  collectRecord,
  formik,
  ignoreValidations,
  managementRegimes,
  resetValidations,
  sites,
}) => {
  const hasData = false
  const managementSelectOptions = getOptions(managementRegimes, hasData)
  const siteSelectOptions = getOptions(sites, hasData)
  const validationsApiData = collectRecord?.validations?.results?.data
  const fishbelt_transect = validationsApiData?.fishbelt_transect
  const sample_event = validationsApiData?.sample_event

  return (
    <>
      <InputWrapper>
        <H2>Sample Info</H2>
        <InputSelectWithLabelAndValidation
          label="Site"
          id="site"
          testId="site"
          options={siteSelectOptions}
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.sample_event.site' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.sample_event.site' })
          }}
          {...getValidationPropertiesForInput(sample_event?.site, areValidationsShowing)}
          {...formik.getFieldProps('site')}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          id="management"
          testId="management"
          options={managementSelectOptions}
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.sample_event.management' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.sample_event.management' })
          }}
          {...getValidationPropertiesForInput(sample_event?.management, areValidationsShowing)}
          {...formik.getFieldProps('management')}
        />
        <InputWithLabelAndValidation
          label="Depth"
          id="depth"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.depth' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.depth' })
          }}
          testId="depth"
          type="number"
          {...getValidationPropertiesForInput(fishbelt_transect?.depth, areValidationsShowing)}
          {...formik.getFieldProps('depth')}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
          id="sample_date"
          testId="sample_date"
          type="date"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.sample_event.sample_date' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.sample_event.sample_date' })
          }}
          {...getValidationPropertiesForInput(sample_event?.sample_date, areValidationsShowing)}
          {...formik.getFieldProps('sample_date')}
        />
        <InputWithLabelAndValidation
          label="Sample Time"
          id="sample_time"
          testId="sample_time"
          type="time"
          ignoreValidations={() => {
            ignoreValidations({ validationPath: 'data.fishbelt_transect.sample_time' })
          }}
          resetValidations={() => {
            resetValidations({ validationPath: 'data.fishbelt_transect.sample_time' })
          }}
          {...formik.getFieldProps('sample_time')}
          {...getValidationPropertiesForInput(
            fishbelt_transect?.sample_time,
            areValidationsShowing,
          )}
        />
      </InputWrapper>
    </>
  )
}

SampleInfoInputs.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  ignoreValidations: PropTypes.func.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  resetValidations: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

SampleInfoInputs.defaultProps = { collectRecord: undefined }

export default SampleInfoInputs
