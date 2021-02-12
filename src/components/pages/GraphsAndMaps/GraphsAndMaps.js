import React from 'react'
// import PropTypes from 'prop-types'
import DataNav from '../../DataNav'
import SubLayout2 from '../../SubLayout2'

/**
 * Describe your component
 */
const GraphsAndMaps = () => {
  return (
    <SubLayout2
      lowerLeft={<DataNav />}
      lowerRight={<>Graphs and Maps Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

GraphsAndMaps.propTypes = {}

export default GraphsAndMaps
