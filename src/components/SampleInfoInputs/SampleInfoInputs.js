import React from 'react'
import PropTypes from 'prop-types'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../generic/InputSelectWithLabelAndValidation'
import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import { formikPropType } from '../../library/formikPropType'
import {
  managementRegimePropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'
import { getOptions } from '../../library/getOptions'

const SampleInfoInputs = ({ formik, sites, managementRegimes }) => {
  const hasData = false
  const siteSelectOptions = getOptions(sites, hasData)
  const managementSelectOptions = getOptions(managementRegimes, hasData)

  return (
    <>
      <InputWrapper>
        <H2>Sample Info</H2>
        <InputSelectWithLabelAndValidation
          label="Site"
          id="site"
          options={siteSelectOptions}
          {...formik.getFieldProps('site')}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          id="management"
          options={managementSelectOptions}
          {...formik.getFieldProps('management')}
        />
        <InputWithLabelAndValidation
          label="Depth"
          id="depth"
          type="number"
          {...formik.getFieldProps('depth')}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
          id="sample_date"
          type="date"
          {...formik.getFieldProps('sample_date')}
        />
        <InputWithLabelAndValidation
          label="Sample Time"
          id="sample_time"
          type="time"
          {...formik.getFieldProps('sample_time')}
        />
      </InputWrapper>
    </>
  )
}

SampleInfoInputs.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  formik: formikPropType.isRequired,
}

export default SampleInfoInputs
