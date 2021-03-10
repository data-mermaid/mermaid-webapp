import React from 'react'
import PropTypes from 'prop-types'
import InputSelect from '../generic/InputSelect'
import InputNumber from '../generic/InputNumber'

/**
 * Describe your component
 */
const CollectForms = ({
  collectRecord,
  sites,
  managementRegimes,
  handleInputChange,
}) => {
  const { site, management, depth } = collectRecord

  return (
    <>
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
      <InputNumber
        name="depth"
        label="Depth"
        value={depth}
        onChange={handleInputChange}
      />
    </>
  )
}

CollectForms.propTypes = {
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

export default CollectForms
