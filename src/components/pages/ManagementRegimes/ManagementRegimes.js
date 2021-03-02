import React from 'react'
import { useParams } from 'react-router-dom'
import NavMenu from '../../NavMenu'
// import PropTypes from 'prop-types'
import SubLayout2 from '../../SubLayout2'

/**
 * Describe your component
 */
const ManagementRegimes = () => {
  const { workflow } = useParams()

  return (
    <SubLayout2
      lowerLeft={<NavMenu />}
      lowerRight={<>Management Regimes Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

ManagementRegimes.propTypes = {}

export default ManagementRegimes
