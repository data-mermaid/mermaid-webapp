import React from 'react'
// import PropTypes from 'prop-types'
import SubLayout2 from '../../SubLayout2'
import CollectingNav from '../../CollectingNav'

/**
 * Describe your component
 */
const CollectRecord = () => {
  return (
    <SubLayout2
      lowerLeft={<CollectingNav />}
      lowerRight={<>Collect Record</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

// CollectRecord.propTypes = {}

export default CollectRecord
