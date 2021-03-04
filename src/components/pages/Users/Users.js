import React from 'react'
import NavMenu from '../../NavMenu'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const Users = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Users Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

// Users.propTypes = {}

export default Users
