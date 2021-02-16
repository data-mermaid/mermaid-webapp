import React from 'react'
import AdminNav from '../../AdminNav'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const Users = () => {
  return (
    <SubLayout2
      lowerLeft={<AdminNav />}
      lowerRight={<>Users Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

// Users.propTypes = {}

export default Users
