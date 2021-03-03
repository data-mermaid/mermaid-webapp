import React from 'react'
// import PropTypes from 'prop-types'
import NavMenu from '../../NavMenu'
import SubLayout2 from '../../SubLayout2'

/**
 * Describe your component
 */
const GraphsAndMaps = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Graphs and Maps Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

GraphsAndMaps.propTypes = {}

export default GraphsAndMaps
