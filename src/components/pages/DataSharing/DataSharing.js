import React from 'react'
import AdminNav from '../../AdminNav'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const DataSharing = () => {
  return (
    <SubLayout2
      lowerLeft={<AdminNav />}
      lowerRight={<>Data Sharing Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

// DataSharing.propTypes = {}

export default DataSharing
