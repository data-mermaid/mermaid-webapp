import React from 'react'
import PropTypes from 'prop-types'

import {
  managementRegimePropType,
  sitePropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'

const SampleEventInputs = ({ formik, managementRegimes, sites, hasData }) => {
  const managementSelectOptions = getOptions(managementRegimes, hasData)
  const siteSelectOptions = getOptions(sites, hasData)

  const handleSiteChange = (event) => {
    formik.handleChange(event)
  }

  const handleManagementChange = (event) => {
    formik.handleChange(event)
  }

  const handleSampleDateChange = (event) => {
    formik.handleChange(event)
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
          onBlur={formik.handleBlur}
          value={formik.values.site}
          onChange={handleSiteChange}
        />
        <InputSelectWithLabelAndValidation
          label="Management"
          required={true}
          id="management"
          testId="management"
          options={managementSelectOptions}
          onBlur={formik.handleBlur}
          value={formik.values.management}
          onChange={handleManagementChange}
        />
        <InputWithLabelAndValidation
          label="Sample Date"
          required={true}
          id="sample_date"
          testId="sample_date"
          type="date"
          onBlur={formik.handleBlur}
          value={formik.values.sample_date}
          onChange={handleSampleDateChange}
        />
      </InputWrapper>
    </>
  )
}

SampleEventInputs.propTypes = {
  formik: formikPropType.isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  hasData: PropTypes.bool,
}

SampleEventInputs.defaultProps = {
  hasData: false,
}

export default SampleEventInputs
