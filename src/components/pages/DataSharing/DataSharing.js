import React from 'react'
import NavMenu from '../../NavMenu'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const DataSharing = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Data Sharing Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

// DataSharing.propTypes = {}

export default DataSharing
