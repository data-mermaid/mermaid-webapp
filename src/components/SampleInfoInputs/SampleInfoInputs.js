import React from 'react'
import PropTypes from 'prop-types'
import InputWithLabelAndValidation from '../generic/InputWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../generic/InputSelectWithLabelAndValidation'
import { H2 } from '../generic/text'

import { formikPropType } from '../../library/formikHelpers/formikPropType'
import {
  managementRegimePropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const SampleInfoInputs = ({ formik, sites, managementRegimes }) => {
  const siteSelectOptions = sites.map((site) => ({
    label: site.name,
    value: site.id,
  }))

  const managementSelectOptions = managementRegimes.map((regime) => ({
    label: regime.name,
    value: regime.id,
  }))

  return (
    <>
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
    </>
  )
}

SampleInfoInputs.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  formik: formikPropType.isRequired,
}

export default SampleInfoInputs
