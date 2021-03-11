import React from 'react'
import NavMenu from '../../NavMenu'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

const FishFamilies = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>Fish Families Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

// FishFamilies.propTypes = {}

export default FishFamilies
