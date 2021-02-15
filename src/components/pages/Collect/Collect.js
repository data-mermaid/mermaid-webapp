import React from 'react'
import CollectingNav from '../../CollectingNav'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Project Collect Page
 */
const Collect = () => {
  return (
    <SubLayout2
      lowerLeft={<CollectingNav />}
      lowerRight={<>Collect Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Collect.propTypes = {}

export default Collect
