import React from 'react'
import NavMenu from '../../NavMenu'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Project Admin Page
 */
const Admin = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Admin Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Admin.propTypes = {}

export default Admin
