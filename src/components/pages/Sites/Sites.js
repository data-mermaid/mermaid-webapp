import React from 'react'
// import PropTypes from 'prop-types'
import DataNav from '../../DataNav'
import SubLayout2 from '../../SubLayout2'

/**
 * Describe your component
 */
const Sites = () => {
  return (
    <SubLayout2
      lowerLeft={<DataNav />}
      lowerRight={<>Sites Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Sites.propTypes = {}

export default Sites
