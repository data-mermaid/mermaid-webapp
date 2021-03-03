import React from 'react'
// import PropTypes from 'prop-types'
import NavMenu from '../../NavMenu'
import SubLayout2 from '../../SubLayout2'

/**
 * Describe your component
 */
const Health = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Project Health Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Health.propTypes = {}

export default Health
