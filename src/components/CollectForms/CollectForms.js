import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SampleInfoForms from '../SampleInfoForms'
import TransectForms from '../TransectForms'
import { Column } from '../generic/positioning'

/**
 * Describe your component
 */

const CollectForms = ({
  collectRecord,
  sites,
  managementRegimes,
  handleInputChange,
}) => {
  return (
    <>
      <SampleInfoForms
        collectRecord={collectRecord}
        sites={sites}
        managementRegimes={managementRegimes}
        handleInputChange={handleInputChange}
      />
      <TransectForms />
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
