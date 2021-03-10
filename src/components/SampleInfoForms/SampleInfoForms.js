import React from 'react'
import PropTypes from 'prop-types'
import InputForm from '../generic/InputForm'
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
      <InputForm
        type="select"
        name="site"
        label="Site"
        value={site}
        validation="ok"
        options={sites}
        onChange={handleInputChange}
      />
      <InputForm
        type="select"
        name="management"
        label="Management Regime"
        value={management}
        validation="warning"
        options={managementRegimes}
        onChange={handleInputChange}
      />
      <InputForm type="date" label="Sample Date" validation="ok" />
      <InputForm type="time" label="Sample Time" validation="ok" />
      <InputForm
        type="number"
        name="depth"
        label="Depth"
        value={depth}
        validation="error"
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
