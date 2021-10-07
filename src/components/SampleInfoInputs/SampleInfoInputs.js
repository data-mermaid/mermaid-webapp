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
  onInputChange,
  sites,
}) => {
  const hasData = false
  const managementSelectOptions = getOptions(managementRegimes, hasData)
  const siteSelectOptions = getOptions(sites, hasData)
  const validations = collectRecord?.validations?.results

  return (
    <>
      <InputWrapper>
        <H2>Sample Info</H2>
        <InputSelectWithLabelAndValidation
          label="Site"
          id="site"
          options={siteSelectOptions}
          {...getValidationPropertiesForInput(validations?.site)}
          {...formik.getFieldProps('site')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: 'site' })
          }}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          id="management"
          options={managementSelectOptions}
          {...getValidationPropertiesForInput(validations?.management)}
          {...formik.getFieldProps('management')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: 'management' })
          }}
        />
        <InputWithLabelAndValidation
          label="Depth"
          id="depth"
          type="number"
          {...getValidationPropertiesForInput(validations?.depth)}
          {...formik.getFieldProps('depth')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: 'depth' })
          }}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
          id="sample_date"
          type="date"
          {...formik.getFieldProps('sample_date')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: undefined })
          }}
        />
        <InputWithLabelAndValidation
          label="Sample Time"
          id="sample_time"
          type="time"
          {...formik.getFieldProps('sample_time')}
          onChange={(event) => {
            onInputChange({ event, inputValidationPropertyName: undefined })
          }}
        />
      </InputWrapper>
    </>
  )
}

SampleInfoInputs.propTypes = {
  collectRecord: fishBeltPropType,
  formik: formikPropType.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  onInputChange: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

SampleInfoInputs.defaultProps = { collectRecord: undefined }

export default SampleInfoInputs
