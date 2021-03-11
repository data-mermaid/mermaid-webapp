import React from 'react'
import NavMenu from '../../NavMenu'
// import PropTypes from 'prop-types'
import SubLayout2 from '../../SubLayout2'

const ManagementRegimes = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Management Regimes Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

ManagementRegimes.propTypes = {}

export default ManagementRegimes
