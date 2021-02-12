import React from 'react'
// import PropTypes from 'prop-types'
import DataNav from '../../DataNav'
import SubLayout2 from '../../SubLayout2'

/**
 * Describe your component
 */
const ManagementRegimes = () => {
  return (
    <SubLayout2
      lowerLeft={<DataNav />}
      lowerRight={<>Management Regimes Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

ManagementRegimes.propTypes = {}

export default ManagementRegimes
