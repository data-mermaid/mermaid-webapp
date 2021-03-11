import React from 'react'
import NavMenu from '../../NavMenu'

// import PropTypes from 'prop-types'
import SubLayout2 from '../../SubLayout2'

const Sites = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Sites Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Sites.propTypes = {}

export default Sites
