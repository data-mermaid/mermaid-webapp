import React from 'react'
import DataNav from '../../DataNav'

import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Project Data Page
 */
const Data = () => {
  return (
    <SubLayout2
      lowerLeft={<DataNav />}
      lowerRight={<>Data Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Data.propTypes = {}

export default Data
