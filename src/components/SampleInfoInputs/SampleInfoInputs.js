import React from 'react'
import PropTypes from 'prop-types'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../generic/InputSelectWithLabelAndValidation'
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
  collectRecord,
  formik,
  managementRegimes,
  sites,
  areValidationsShowing,
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
          {...getValidationPropertiesForInput(
            sample_event?.site,
            areValidationsShowing,
          )}
          {...formik.getFieldProps('site')}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          id="management"
          testId="management"
          options={managementSelectOptions}
          {...getValidationPropertiesForInput(
            sample_event?.management,
            areValidationsShowing,
          )}
          {...formik.getFieldProps('management')}
        />
        <InputWithLabelAndValidation
          label="Depth"
          id="depth"
          testId="depth"
          type="number"
          {...getValidationPropertiesForInput(
            fishbelt_transect?.depth,
            areValidationsShowing,
          )}
          {...formik.getFieldProps('depth')}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
          id="sample_date"
          testId="sample_date"
          type="date"
          {...getValidationPropertiesForInput(
            sample_event?.sample_date,
            areValidationsShowing,
          )}
          {...formik.getFieldProps('sample_date')}
        />
        <InputWithLabelAndValidation
          label="Sample Time"
          id="sample_time"
          testId="sample_time"
          type="time"
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
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

SampleInfoInputs.defaultProps = { collectRecord: undefined }

export default SampleInfoInputs
