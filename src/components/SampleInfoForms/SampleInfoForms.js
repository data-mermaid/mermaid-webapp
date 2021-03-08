import React from 'react'
import PropTypes from 'prop-types'
import InputSelect from '../generic/InputSelect'
import InputNumber from '../generic/InputNumber'
import InputDate from '../generic/InputDate'
import InputTime from '../generic/InputTime'
import { H2 } from '../generic/text'

/**
 * Describe your component
 */
const SampleInfoForms = ({
  collectRecord,
  sites,
  managementRegimes,
  handleInputChange,
}) => {
  const { site, management, depth } = collectRecord

  return (
    <>
      <H2>Sample Info</H2>
      <InputSelect
        name="site"
        label="Site"
        options={sites}
        value={site}
        onChange={handleInputChange}
      />
      <InputSelect
        name="management"
        label="Management Regime"
        value={management}
        options={managementRegimes}
        onChange={handleInputChange}
      />
      <InputDate label="Sample Date" />
      <InputTime label="Sample Time" />
      <InputNumber
        name="depth"
        label="Depth"
        value={depth}
        onChange={handleInputChange}
      />
    </>
  )
}

SampleInfoForms.propTypes = {
  collectRecord: PropTypes.shape({
    site: PropTypes.string,
    management: PropTypes.string,
    depth: PropTypes.number,
  }).isRequired,
  sites: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  managementRegimes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
}

export default SampleInfoForms
