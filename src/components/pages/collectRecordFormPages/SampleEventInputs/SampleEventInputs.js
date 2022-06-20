import PropTypes from 'prop-types'
import React from 'react'

import {
  managementRegimePropType,
  sitePropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import { InputWrapper } from '../../../generic/form'
import InputSelectWithLabelAndValidation from '../../../mermaidInputs/InputSelectWithLabelAndValidation'

const SampleEventInputs = ({ formik, managementRegimes, sites }) => {
  const managementSelectOptions = getOptions(managementRegimes, false)
  const siteSelectOptions = getOptions(sites, false)

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
}

export default SampleEventInputs
